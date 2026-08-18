# Getting started — de zéro à un service en HTTPS

Guide complet pour partir d'un **Proxmox vierge** et arriver à un cluster
Kubernetes GitOps fonctionnel, avec un premier service accessible en HTTPS.
Compte 1 à 2h la première fois (essentiellement de l'attente : téléchargement
d'image, boot des VMs, émission de certificat).

## 0. Prérequis

### Côté Proxmox / réseau

- Un hôte **Proxmox VE** installé et accessible (interface web + API), avec
  assez de ressources libres pour 5 VMs (voir le dimensionnement par défaut
  ci-dessous — ajustable dans `terraform/proxmox/variables.tf`).
- Un **storage** avec assez d'espace pour les disques des VMs (par défaut :
  3× 40 Go + 2× 100 Go = 320 Go). `local-lvm` par défaut sur Proxmox est
  souvent trop petit — vérifie avec `pvesm status`, choisis un storage plus
  grand si besoin.
- Un **bridge réseau** (`vmbrX`) routé vers un LAN avec une plage d'IP
  libres pour tes VMs, et **quelques IP libres supplémentaires** dans ce même
  LAN pour MetalLB (le load balancer qui exposera Traefik).
- Accès à ton **routeur/firewall** pour rediriger les ports **80 et 443**
  vers l'IP MetalLB de Traefik (à faire après le bootstrap, étape 8).
- Le **NTP sortant doit être autorisé** sur le VLAN des VMs. Sans ça, les
  nœuds Talos restent bloqués en boot indéfiniment (Talos refuse de démarrer
  sans horloge synchronisée) — c'est le piège le plus sournois de ce guide,
  voir la section Dépannage.

### Comptes et accès à préparer

- Un **nom de domaine** dont tu contrôles la zone DNS sur **Cloudflare**.
- Un **token API Cloudflare** scopé sur cette zone uniquement, permission
  `Zone → DNS → Edit` (récupérable sur
  [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)).
- Le **Zone ID** de ton domaine (visible sur la page d'accueil de la zone,
  colonne de droite).
- Un **token API Proxmox** : Datacenter → Permissions → API Tokens → créer un
  token pour un utilisateur ayant le rôle `PVEAdmin` (ou équivalent) sur le
  node cible. Format : `user@pve!nom-du-token=xxxxxxxx-...`.
- Une **paire de clés SSH** dédiée pour que Terraform puisse se connecter en
  root à l'hôte Proxmox (l'API seule ne suffit pas pour l'upload de
  snippets/images) : `ssh-keygen -t ed25519 -f ~/.ssh/proxmox_terraform_ed25519`,
  puis ajoute la clé publique dans `~/.ssh/authorized_keys` sur l'hôte Proxmox.

### Outils locaux

`terraform` (≥ 1.5), `kubectl`, `kubeseal`, `git`. `talosctl` est utile pour
le debug mais pas strictement nécessaire (tout passe par le provider
Terraform `siderolabs/talos`).

## 1. Préparer le storage Proxmox

Le storage qui recevra l'image Talos téléchargée doit supporter le type de
contenu `import` (ou `iso`) — ce n'est pas activé par défaut sur le storage
`local` :

```bash
pvesm set local --content iso,vztmpl,backup,import
```

## 2. Cloner le repo et configurer Terraform

```bash
git clone https://github.com/gabriel25115CG/IAC-Homelab.git
cd IAC-Homelab
```

Copie et remplis les trois fichiers de variables (jamais commit, voir
`.gitignore`) :

```bash
cp terraform/proxmox/terraform.tfvars.example terraform/proxmox/terraform.tfvars
cp terraform/cloudflare/terraform.tfvars.example terraform/cloudflare/terraform.tfvars
```

- `terraform/proxmox/terraform.tfvars` : URL/token API Proxmox, chemin de la
  clé SSH, nom du node, storage, bridge réseau, passerelle. Les tailles de VM
  et plages d'IP sont dans `terraform/proxmox/variables.tf` (valeurs par
  défaut : 3 control-plane 2 vCPU/8 Go/40 Go, 2 workers 4 vCPU/16 Go/100 Go —
  ajuste selon ton matériel).
- `terraform/cloudflare/terraform.tfvars` : token API, zone ID, ton domaine,
  et l'IP publique de ton réseau.
- `terraform/talos/variables.tf` n'a pas de secrets, mais si tu changes le
  bridge/la passerelle/les noms de nœuds côté `proxmox`, reporte les mêmes
  valeurs ici (les deux dossiers ont des states indépendants et ne se
  connaissent pas entre eux — voir `terraform/README.md`).

## 3. Provisionner l'infrastructure (3 passes)

L'ordre exact est documenté dans `terraform/README.md` (les VMs doivent
démarrer directement avec la machine config Talos en user-data, donc
`talos` doit tourner une première fois avant `proxmox`) :

```bash
# 1) Génère les machine configs Talos (aucune VM n'existe encore)
cd terraform/talos
terraform init
terraform apply \
  -target=talos_machine_secrets.this \
  -target=data.talos_machine_configuration.this \
  -target=local_file.rendered

# 2) Crée les VMs sur Proxmox (boot direct sur IP statique)
cd ../proxmox
terraform init
terraform apply

# 3) Configure les VMs démarrées, bootstrap le control-plane, récupère les configs
cd ../talos
terraform apply
```

Récupère `kubeconfig` et `talosconfig` (jamais commit) :

```bash
terraform output -raw kubeconfig > ../../kubeconfig
terraform output -raw talosconfig > ../../talosconfig
export KUBECONFIG=$(pwd)/../../kubeconfig
kubectl get nodes
```

Tous les nœuds doivent apparaître `Ready` avant de continuer.

## 4. Bootstrap GitOps (ArgoCD)

```bash
cd ../..   # racine du repo
kubectl apply -k kubernetes/bootstrap/argocd
kubectl -n argocd rollout status deploy/argocd-server
kubectl apply -f kubernetes/bootstrap/argocd/app-of-apps.yaml
```

L'`ApplicationSet` scanne `kubernetes/apps/*` et crée automatiquement une
`Application` ArgoCD par dossier : `metallb`, `sealed-secrets`,
`cert-manager`, `longhorn`, `traefik`, `demo-app`. Détail complet dans
[`bootstrap.md`](bootstrap.md), y compris la génération du `SealedSecret` du
token Cloudflare pour cert-manager (étape obligatoire, sans quoi
`cert-manager` ne peut pas résoudre les challenges DNS-01).

## 5. Adapter MetalLB à ton réseau

Le pool d'IP livré par défaut (`10.20.20.200-10.20.20.220` dans
`kubernetes/apps/metallb/ip-address-pool.yaml`) correspond à **mon** LAN, pas
au tien. Édite ce fichier avec une plage libre de ton propre réseau, commit,
push — ArgoCD applique le changement automatiquement.

## 6. DNS Cloudflare

```bash
cd terraform/cloudflare
terraform apply
```

Crée l'enregistrement wildcard `*.tondomaine` → ton IP publique. Une seule
fois : tout sous-domaine futur (`demo.`, `argocd.`, `monapp.`...) est couvert
sans intervention manuelle.

## 7. Rediriger les ports sur ton routeur

Récupère l'IP attribuée à Traefik par MetalLB :

```bash
kubectl -n traefik get svc traefik
```

Configure ton routeur/firewall pour rediriger les ports **80 et 443**
(WAN) vers cette IP (LAN).

## 8. Vérifier

```bash
kubectl -n argocd get applications          # tout doit être Synced/Healthy
kubectl -n demo-app get ingress
curl -I https://demo.tondomaine
```

Le premier certificat est émis par `letsencrypt-staging` (non fiable pour un
navigateur, mais évite d'épuiser le rate-limit Let's Encrypt pendant les
tests). Une fois que tout fonctionne, bascule les `Ingress` sur
`letsencrypt-prod` (voir `kubernetes/apps/cert-manager/`).

## 9. Déployer un vrai service

Voir [`cicd.md`](cicd.md) : crée `app/<nom>/` avec ton code, commit, push sur
`master`. La CI build l'image, scaffold les manifests Kubernetes au premier
push, ArgoCD déploie, et `<nom>.tondomaine` est en HTTPS automatiquement.

---

## Dépannage — pièges réels rencontrés en déployant ce projet

- **Les VMs restent bloquées en "Booting" indéfiniment** : NTP sortant
  bloqué par le pare-feu sur le VLAN des VMs. Talos refuse de démarrer sans
  horloge synchronisée. Autorise le trafic NTP (UDP 123) sortant sur ce VLAN.
- **`terraform apply` échoue sur le téléchargement de l'image Talos**
  (`decompression not supported`) : le storage doit être en `content_type =
  "iso"` (pas `"import"`) pour que la décompression gzip fonctionne — déjà
  configuré dans ce repo, mentionné ici si tu adaptes le code.
- **Longhorn crash avec `iscsiadm: command not found`** : l'image Talos par
  défaut n'a pas les extensions nécessaires. Ce repo utilise déjà un
  schematic Image Factory avec `siderolabs/iscsi-tools` et
  `siderolabs/util-linux-tools` (`talos_schematic_id` dans les deux
  `variables.tf`) — ne le remplace pas par une image Talos "nue" si tu comptes
  utiliser Longhorn.
- **Un composant (Longhorn, node-exporter...) refuse de démarrer avec une
  erreur `PodSecurity`** : Talos applique l'admission `baseline` par défaut
  hors `kube-system`. Les composants ayant légitimement besoin de
  privilèges doivent tourner dans un namespace explicitement labellisé
  `pod-security.kubernetes.io/enforce: privileged` (voir
  `kubernetes/apps/longhorn/namespace.yaml` comme modèle).
- **Une `Application` ArgoCD reste bloquée en `Synced` mais visiblement pas
  à jour, ou passe en statut `Unknown`** : deux causes possibles.
  1. Une CRD dépasse 256 Ko one fois sérialisée en annotation
     `kubectl.kubectl.io/last-applied-configuration` (courant avec
     Prometheus Operator ou de grosses CRD) → l'`ApplicationSet` de ce repo a
     déjà `ServerSideApply=true` en syncOption global pour éviter ça.
  2. Une valeur Helm invalide fait échouer le rendu
     `kustomize build --enable-helm` (validation stricte contre le
     `values.schema.json` du chart) → ArgoCD affiche un statut `Unknown`
     sans erreur visible ailleurs que dans
     `kubectl get application <nom> -n argocd -o jsonpath='{.status.conditions}'`.
     **Toujours vérifier le schéma exact du chart avant d'ajouter une clé
     Helm custom** (`values.schema.json` du chart, ou son `values.yaml`
     commenté) plutôt que de deviner un nom de clé.
- **Une mise à jour applicative (Deployment) reste bloquée avec une erreur
  `Multi-Attach`** : un PVC `ReadWriteOnce` ne peut pas être monté par
  l'ancien et le nouveau pod s'ils atterrissent sur des nœuds différents
  pendant un `RollingUpdate`. Passe la stratégie de déploiement en
  `Recreate` pour tout workload avec un volume RWO.
- **Un mot de passe généré par Helm (ex: admin Grafana) change à chaque
  sync** : les fonctions Helm comme `randAlphaNum` sont réévaluées à chaque
  rendu (`helm template` est sans état), alors que l'application ne lit la
  valeur qu'une seule fois à la création. Ne jamais générer un secret
  persistant via une valeur Helm aléatoire : utilise un vrai `Secret`/
  `SealedSecret` fixe.
