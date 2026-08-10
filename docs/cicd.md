# CI/CD applicatif

Le workflow réutilisable `.github/workflows/app-deploy.yml` de ce repo (`IAC-Homelab`) permet à n'importe quel repo applicatif externe de :

1. Builder son image Docker.
2. La pousser sur GHCR, taguée avec le SHA court du commit.
3. Bumper automatiquement le tag d'image dans `kubernetes/apps/<app_name>/kustomization.yaml` de ce repo (commit + push sur `main`).
4. Laisser ArgoCD détecter le changement et resynchroniser l'`Application` correspondante.

## Prérequis côté ce repo

- Le dossier `kubernetes/apps/<app_name>/` doit exister avec un `kustomization.yaml` qui référence l'image via une entrée `images:` (voir `kubernetes/apps/demo-app/kustomization.yaml` comme modèle).

## Prérequis côté repo applicatif externe

- Un `Dockerfile` à la racine (ou adapter le `context`).
- Un Personal Access Token (ou GitHub App token) avec droit `contents: write` sur `IAC-Homelab`, stocké en secret du repo applicatif (ex: `IAC_HOMELAB_TOKEN`).

## Exemple de workflow appelant

`.github/workflows/deploy.yml` dans le repo `portfolio` :

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: gabriel25115CG/IAC-Homelab/.github/workflows/app-deploy.yml@main
    with:
      app_name: portfolio
      image_name: ghcr.io/gabriel25115cg/portfolio
    secrets:
      token: ${{ secrets.IAC_HOMELAB_TOKEN }}
```

Le job `bump-manifest` du workflow réutilisable clone `IAC-Homelab`, exécute `kustomize edit set image` dans `kubernetes/apps/portfolio/`, puis commit et push sur `main`. ArgoCD (via l'`ApplicationSet` `apps`) détecte le changement au prochain cycle de sync et redéploie automatiquement la nouvelle image.
