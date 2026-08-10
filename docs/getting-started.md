# Getting started — de zéro à un service en HTTPS

Ordre global des étapes pour partir d'un homelab vide et arriver à un service accessible en `https://<sous-domaine>.gabriel0day.cloud` :

1. **Provisionner l'infrastructure** : VMs Talos sur Proxmox + bootstrap du cluster Kubernetes + wildcard DNS Cloudflare. Voir `terraform/README.md` (module `terraform/`, hors périmètre de ce dossier).
2. **Comprendre l'architecture cible** : lire `docs/architecture.md` pour le flux GitOps complet (Terraform → cluster → ArgoCD → apps).
3. **Bootstrap GitOps manuel (une seule fois)** : suivre `docs/bootstrap.md` — récupération du kubeconfig, installation d'ArgoCD, application de l'app-of-apps, génération du `SealedSecret` Cloudflare pour cert-manager.
4. **Vérifier que la stack de base tourne** : ArgoCD doit afficher les `Application` `metallb`, `sealed-secrets`, `cert-manager`, `longhorn`, `traefik`, `demo-app` en `Synced`/`Healthy`. `https://demo.gabriel0day.cloud` doit répondre avec un certificat Let's Encrypt valide (basculer `letsencrypt-staging` → `letsencrypt-prod` une fois validé).
5. **Déployer un vrai service (ex: portfolio)** :
   - Créer `kubernetes/apps/portfolio/` sur le modèle de `kubernetes/apps/demo-app/` (Deployment, Service, Ingress avec host `portfolio.gabriel0day.cloud` et annotation `cert-manager.io/cluster-issuer: letsencrypt-prod`).
   - Commit + push sur `main` : l'`ApplicationSet` `apps` (voir `kubernetes/bootstrap/argocd/app-of-apps.yaml`) crée automatiquement l'`Application` ArgoCD correspondante.
   - Aucune étape DNS ou certificat manuelle : le wildcard DNS et le futur certificat wildcard couvrent tout `*.gabriel0day.cloud`.
6. **Brancher la CI/CD applicative** : dans le repo externe du service (ex: `portfolio`), utiliser le workflow réutilisable `app-deploy.yml` pour automatiser build → push GHCR → bump du tag d'image → sync ArgoCD. Voir `docs/cicd.md`.

## Documents de référence

- `docs/architecture.md` — schéma et explication du flux GitOps.
- `docs/bootstrap.md` — commandes exactes du premier bootstrap.
- `docs/cicd.md` — intégration CI/CD pour un repo applicatif externe.
- `terraform/README.md` — provisioning de l'infrastructure (Proxmox, Talos, Cloudflare), maintenu par ailleurs.
