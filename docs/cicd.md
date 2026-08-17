# CI/CD applicatif

Objectif : un développeur peut ajouter/modifier une app sans **aucune**
connaissance infra — pas de Dockerfile à écrire, pas de Kubernetes à toucher.
Tout ce qui est build/déploiement est géré par ce repo et sa CI.

## Structure

- `app/<nom>/` — **uniquement du code applicatif** (ex: un projet Vite+React).
  Rien d'autre : pas de Dockerfile, pas de manifest.
- `ci/templates/<type>/` — les templates de build gérés par l'infra (ex:
  `ci/templates/spa/Dockerfile` pour une SPA JS buildée en statique et servie
  par nginx). Un développeur n'a jamais besoin d'ouvrir ce dossier.
- `kubernetes/apps/<nom>/` — les manifests Kubernetes de l'app (créés une fois
  par la personne qui ajoute l'app, ou copiés depuis `kubernetes/apps/portfolio/`
  comme modèle).

## Ce que fait `.github/workflows/app-deploy.yml`

1. Se déclenche sur push vers `master` touchant `app/**`.
2. Détecte quel(s) dossier(s) sous `app/` ont changé (diff entre l'ancien et le
   nouveau commit).
3. Pour chaque app changée : construit l'image Docker en utilisant
   `ci/templates/spa/Dockerfile` (le contexte de build reste `app/<nom>`, seul
   le Dockerfile vient d'ailleurs — le développeur n'en a jamais besoin), la
   pousse sur GHCR taguée avec le SHA court du commit (et `latest`).
4. Bump automatiquement le tag d'image dans `kubernetes/apps/<nom>/kustomization.yaml`
   (commit + push sur `master` — ce chemin n'est pas sous `app/**`, donc ça ne
   redéclenche pas le workflow).
5. ArgoCD (via l'`ApplicationSet` `apps`) détecte le changement au prochain
   cycle de sync et redéploie automatiquement la nouvelle image.

Tout se passe avec le `GITHUB_TOKEN` par défaut de l'action (permissions
`contents: write` + `packages: write` déclarées dans le workflow) — pas de
Personal Access Token à créer ni à stocker en secret.

## Ajouter une nouvelle app (côté développeur)

1. Crée `app/<nom>/` avec le code source uniquement (ex: `npm create vite@latest
   app/<nom> -- --template react`).
2. Commit, push (ou PR + merge) sur `master`.

C'est tout — si `ci/templates/spa/` convient au type d'app (SPA JS/React buildée
en statique), il n'y a rien d'autre à faire côté code pour que la CI construise
et publie l'image.

## Ajouter une nouvelle app (côté infra, une fois)

Il faut quand même déclarer où et comment l'app tourne sur le cluster :

1. Crée `kubernetes/apps/<nom>/` avec `deployment.yaml`, `service.yaml`,
   `ingress.yaml` (host `<nom>.gabriel0day.cloud`) et un `kustomization.yaml`
   avec une entrée `images:` pointant vers `ghcr.io/<owner>/<nom>` (voir
   `kubernetes/apps/portfolio/` comme modèle).
2. Si l'app n'est pas une SPA JS statique (ex: elle a besoin d'un serveur
   Node qui tourne, d'une base de données, etc.), il faudra un nouveau
   template sous `ci/templates/` et une entrée dans la matrice de build du
   workflow — toujours géré côté infra, jamais par le développeur de l'app.

## Rendre le package GHCR public

Par défaut, un package GHCR poussé via `GITHUB_TOKEN` est privé, ce qui
bloquerait le pull depuis le cluster (pas d'`imagePullSecret` configuré). Après
le tout premier push d'une image `<nom>` : va sur
`https://github.com/users/<owner>/packages/container/<nom>/settings` et passe
la visibilité en **Public**. À refaire une fois par app (pas à chaque build).
