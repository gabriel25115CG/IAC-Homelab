# CI/CD applicatif

Objectif : un développeur peut ajouter une app avec **zéro** connaissance
infra — pas de Dockerfile, pas de Kubernetes, pas de nom de domaine à
déclarer. Il ajoute du code sous `app/<nom>/`, et tout le reste (build,
manifests K8s, sous-domaine, HTTPS) est généré automatiquement à partir du
nom du dossier.

## Structure

- `app/<nom>/` — **uniquement du code applicatif** (ex: un projet Vite+React).
  Rien d'autre : pas de Dockerfile, pas de manifest. Le nom de ce dossier
  devient à la fois le nom de l'image Docker et le sous-domaine
  (`<nom>.gabriel0day.cloud`).
- `ci/templates/spa/` — le Dockerfile générique (build Node → nginx) géré par
  l'infra. Un développeur n'a jamais besoin d'ouvrir ce dossier.
- `ci/templates/k8s-spa/` — le template des manifests Kubernetes
  (`deployment.yaml`, `service.yaml`, `ingress.yaml`, `kustomization.yaml`)
  avec des placeholders `__APP_NAME__` / `__OWNER__`.
- `kubernetes/apps/<nom>/` — généré automatiquement par la CI au premier push
  d'une app inconnue (voir plus bas). Pas besoin de le créer à la main.

## Ce que fait `.github/workflows/app-deploy.yml`

1. Se déclenche sur push vers `master` touchant `app/**`.
2. Détecte quel(s) dossier(s) sous `app/` ont changé (diff entre l'ancien et le
   nouveau commit).
3. Pour chaque app changée : construit l'image Docker en utilisant
   `ci/templates/spa/Dockerfile` (le contexte de build reste `app/<nom>`, seul
   le Dockerfile vient d'ailleurs), la pousse sur GHCR taguée avec le SHA
   court du commit (et `latest`).
4. Si `kubernetes/apps/<nom>/` n'existe pas encore : le génère depuis
   `ci/templates/k8s-spa/`, en remplaçant `__APP_NAME__` par le nom du dossier
   et `__OWNER__` par le propriétaire du repo (donc `host:
   <nom>.gabriel0day.cloud` automatiquement, sans jamais l'écrire à la main).
5. Bump le tag d'image dans `kubernetes/apps/<nom>/kustomization.yaml`, commit
   + push sur `master` (ce chemin n'est pas sous `app/**`, donc ça ne
   redéclenche pas le workflow).
6. ArgoCD (via l'`ApplicationSet` `apps`) détecte le nouveau dossier ou le
   changement au prochain cycle de sync, crée l'`Application` si besoin, et
   déploie. DNS (wildcard) et HTTPS (cert-manager) suivent automatiquement.

Tout se passe avec le `GITHUB_TOKEN` par défaut de l'action (permissions
`contents: write` + `packages: write` déclarées dans le workflow) — pas de
Personal Access Token à créer ni à stocker en secret.

## Ajouter une nouvelle app

1. Crée `app/<nom>/` avec le code source uniquement (ex: `npm create vite@latest
   app/<nom> -- --template react`).
2. Commit, push (ou PR + merge) sur `master`.

C'est tout. Si l'app est une SPA JS/React buildée en statique (ce que couvre
`ci/templates/spa` + `ci/templates/k8s-spa`), il n'y a **rien d'autre** à
faire : le sous-domaine `<nom>.gabriel0day.cloud` est disponible dès le
premier déploiement.

## Si l'app n'est pas une SPA statique

Une app qui a besoin d'un serveur Node qui tourne, d'une base de données, etc.
ne rentre pas dans `ci/templates/spa`/`k8s-spa`. Il faudra alors, côté infra
(jamais côté développeur de l'app) :

1. Un nouveau template sous `ci/templates/` (Dockerfile adapté).
2. Un nouveau template de manifests K8s si la forme diffère (ex: pas de
   `Ingress` pour un worker sans HTTP).
3. Une logique dans le workflow pour choisir quel template appliquer selon le
   type d'app détecté (ex: présence d'un fichier marqueur, ou une petite
   convention de nommage de dossier).

## Rendre le package GHCR public

Par défaut, un package GHCR poussé via `GITHUB_TOKEN` est privé, ce qui
bloquerait le pull depuis le cluster (pas d'`imagePullSecret` configuré). Si
le repo lui-même est public, les nouveaux packages héritent automatiquement
de la visibilité publique (vérifié en pratique — rien à faire). Si le repo
est privé, il faudra rendre chaque package public une fois manuellement via
`https://github.com/users/<owner>/packages/container/<nom>/settings`, ou
mettre en place un `imagePullSecret`.
