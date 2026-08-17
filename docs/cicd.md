# CI/CD applicatif

Toutes les applications vivent dans ce même repo (`IAC-Homelab`), sous `app/<nom>/`
(code source + `Dockerfile`), avec leurs manifests Kubernetes dans
`kubernetes/apps/<nom>/`. Le workflow `.github/workflows/app-deploy.yml` :

1. Se déclenche sur push vers `master` touchant `app/**`.
2. Détecte quel(s) dossier(s) sous `app/` ont changé (diff entre l'ancien et le
   nouveau commit).
3. Pour chaque app changée : build l'image Docker (`app/<nom>/Dockerfile`), la
   pousse sur GHCR taguée avec le SHA court du commit (et `latest`).
4. Bump automatiquement le tag d'image dans `kubernetes/apps/<nom>/kustomization.yaml`
   (commit + push sur `master`, avec `[skip ci]` implicite puisque ce chemin
   n'est pas sous `app/**` donc ne redéclenche pas le workflow).
5. ArgoCD (via l'`ApplicationSet` `apps`) détecte le changement au prochain
   cycle de sync et redéploie automatiquement la nouvelle image.

Tout se passe avec le `GITHUB_TOKEN` par défaut de l'action (permissions
`contents: write` + `packages: write` déclarées dans le workflow) — pas de
Personal Access Token à créer ni à stocker en secret.

## Ajouter une nouvelle app

1. Crée `app/<nom>/` avec le code source et un `Dockerfile` (voir
   `app/portfolio/` comme modèle : Vite + React, build multi-stage servi par
   nginx).
2. Crée `kubernetes/apps/<nom>/` avec `deployment.yaml`, `service.yaml`,
   `ingress.yaml` (host `<nom>.gabriel0day.cloud`) et un `kustomization.yaml`
   avec une entrée `images:` pointant vers `ghcr.io/<owner>/<nom>` (voir
   `kubernetes/apps/portfolio/` comme modèle).
3. Travaille sur une branche, ouvre une PR, merge sur `master` (ou push direct
   si tu bosses seul) : le pipeline ci-dessus prend le relais automatiquement.

## Rendre le package GHCR public

Par défaut, un package GHCR poussé via `GITHUB_TOKEN` est privé, ce qui
bloquerait le `imagePullSecret`-less pull depuis le cluster. Après le tout
premier push d'une image `<nom>` : va sur
`https://github.com/users/<owner>/packages/container/<nom>/settings` et passe
la visibilité en **Public**. À refaire une fois par app (pas à chaque build).
