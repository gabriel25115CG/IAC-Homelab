# IAC-Homelab

Infrastructure-as-Code complète pour un cluster Kubernetes auto-hébergé sur
Proxmox : provisioning, bootstrap, GitOps, HTTPS automatique, et un pipeline
CI/CD permettant à un développeur d'ajouter une application sans aucune
connaissance infra.

> [!IMPORTANT]
> Ceci est mon infrastructure personnelle réelle, publiée en libre accès
> (licence MIT) pour que d'autres homelabbers puissent s'en servir de base.
> C'est pensé pour être cloné et déployé chez toi, mais **pas branché tel
> quel sur ton domaine/ta prod sans l'adapter** : change les valeurs dans les
> `terraform.tfvars` (domaine, IPs, plages MetalLB, ressources VM), génère
> tes propres secrets (token Cloudflare, etc.), et relis les manifests avant
> d'appliquer. Aucune garantie n'est fournie (voir [LICENSE](LICENSE)) — c'est
> mon setup perso, pas un produit maintenu.

## Architecture

```
GitHub (ce repo)
   │
   │  push sur master (app/**)
   ▼
GitHub Actions — .github/workflows/app-deploy.yml
   │  build l'image Docker (template ci/templates/spa)
   │  push sur GHCR
   │  scaffold kubernetes/apps/<app> si nouveau (template ci/templates/k8s-spa)
   │  bump le tag d'image, commit + push
   ▼
ArgoCD (dans le cluster) — détecte kubernetes/apps/* via un ApplicationSet
   ▼
Cluster Kubernetes (Talos Linux, 3 control-plane + 2 workers sur Proxmox)
   ├── MetalLB       → IP LoadBalancer sur le LAN pour Traefik
   ├── Traefik       → Ingress, reçoit le trafic 80/443 (port-forward routeur)
   ├── cert-manager  → certificats Let's Encrypt automatiques (DNS-01 Cloudflare)
   ├── Longhorn      → stockage persistant (extension Talos iscsi-tools)
   ├── Sealed Secrets → secrets chiffrés committables sans risque
   └── kubernetes/apps/<app> → une Application ArgoCD par dossier

Cloudflare DNS : *.gabriel0day.cloud → IP publique (wildcard, un seul enregistrement)
```

Le point clé : DNS et certificats sont couverts une fois pour toutes par un
wildcard. Ajouter un service = ajouter un dossier sous `app/` ou
`kubernetes/apps/` ; le sous-domaine et le HTTPS suivent automatiquement.

## Services en ligne

| Service | URL | Description |
|---|---|---|
| ArgoCD | https://argocd.gabriel0day.cloud | Interface GitOps |
| Portfolio | https://portfolio.gabriel0day.cloud | App de test (Vite + React) |
| Demo | https://demo.gabriel0day.cloud | `traefik/whoami`, patron minimal |

## Structure du repo

```
terraform/
  proxmox/     — provisionne les VMs Talos sur Proxmox (image nocloud, IP statique)
  talos/       — génère les machine configs Talos, bootstrap le cluster
  cloudflare/  — enregistrement DNS wildcard *.gabriel0day.cloud

kubernetes/
  bootstrap/argocd/  — installation d'ArgoCD + ApplicationSet "app of apps"
  apps/<nom>/         — manifests d'une app ou d'un service cœur du cluster
                        (une Application ArgoCD par dossier)

app/<nom>/       — code source d'une application (rien d'autre : pas de
                   Dockerfile, pas de manifest — voir docs/cicd.md)

ci/templates/
  spa/           — Dockerfile générique pour une SPA JS (build Node → nginx)
  k8s-spa/       — template de manifests K8s (déploiement, service, ingress)

docs/
  architecture.md    — détail du flux GitOps
  bootstrap.md        — commandes exactes du tout premier démarrage du cluster
  cicd.md             — comment ajouter une app, ce que fait la CI en détail
  getting-started.md  — ordre des étapes de zéro à un service en HTTPS

.github/workflows/
  terraform-plan.yml — fmt/validate/plan sur les modules Terraform (PR)
  app-deploy.yml     — build + déploiement automatique d'une app
```

## Démarrer de zéro

**[`docs/getting-started.md`](docs/getting-started.md) est un guide pas à
pas complet** pour partir d'un Proxmox vierge et arriver à un premier service
en HTTPS : prérequis (Proxmox, réseau, comptes Cloudflare), configuration des
variables Terraform, provisioning en 3 passes, bootstrap ArgoCD, DNS
wildcard, redirection des ports, et une section dépannage listant les vrais
pièges rencontrés en le déployant (NTP bloqué, PodSecurity, PVC RWO, etc.).

En résumé :

1. `terraform/proxmox` puis `terraform/talos` provisionnent et bootstrappent
   le cluster (voir [`terraform/README.md`](terraform/README.md) pour l'ordre
   exact des trois passes).
2. `kubectl apply -k kubernetes/bootstrap/argocd` installe ArgoCD, puis
   `kubectl apply -f kubernetes/bootstrap/argocd/app-of-apps.yaml` active
   l'auto-déploiement de tout ce qui est sous `kubernetes/apps/`.
3. `terraform/cloudflare` crée le DNS wildcard.

## Ajouter une nouvelle application

Voir [`docs/cicd.md`](docs/cicd.md) pour le détail. En résumé, pour une SPA
JS/React :

1. Crée `app/<nom>/` avec ton code (ex: `npm create vite@latest app/<nom> --
   --template react`).
2. Commit, push sur `master`.

C'est tout. La CI build l'image, génère les manifests Kubernetes si l'app est
nouvelle, ArgoCD déploie, et `<nom>.gabriel0day.cloud` est en HTTPS
automatiquement — aucune étape manuelle, aucune connaissance infra requise.

## Sécurité

- Aucun secret en clair dans le repo : tokens API (Proxmox, Cloudflare)
  restent dans des `terraform.tfvars` locaux ignorés par git ; les secrets
  Kubernetes sont chiffrés via [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)
  avant d'être committés.
- `GITHUB_TOKEN` (permissions `contents: write` + `packages: write`) suffit à
  toute la CI — pas de Personal Access Token à gérer.
- Talos applique par défaut l'admission `PodSecurity: baseline` sur tout
  namespace hors `kube-system` ; les composants qui en ont légitimement besoin
  (ex: Longhorn) sont explicitement passés en `privileged`.
- Vulnérabilité trouvée ? Voir [SECURITY.md](SECURITY.md) (signalement privé,
  pas d'issue publique).

## Contributions

Ce dépôt n'accepte pas de pull requests externes : c'est mon infrastructure
personnelle, pas un projet communautaire maintenu. Sens-toi libre de le
**forker** et de l'adapter chez toi (licence MIT), mais les PR/issues externes
ne seront pas traitées ici (les interactions du dépôt sont restreintes aux
collaborateurs).
