# Security Policy

Ce dépôt fait tourner une infrastructure personnelle réelle (cluster Kubernetes
auto-hébergé). Si tu trouves une vulnérabilité (dans le code IaC, les workflows
CI, ou une mauvaise pratique de sécurité exploitable), merci de la signaler de
façon responsable plutôt que de l'exploiter ou de la divulguer publiquement.

## Comment signaler

Utilise l'onglet **Security → Report a vulnerability** de ce dépôt GitHub
(Security Advisories privés) plutôt qu'une issue publique. Décris :

- le fichier/composant concerné,
- l'impact potentiel,
- si possible, un moyen de reproduire.

Je m'engage à accuser réception sous quelques jours et à corriger dans un délai
raisonnable selon la sévérité.

## Portée

- Le code Terraform/Kubernetes/CI de ce dépôt.
- Les templates (`ci/templates/`) utilisés pour scaffolder les apps.

Hors périmètre : mon infrastructure physique elle-même (le homelab n'est pas un
programme de bug bounty), et les vulnérabilités déjà connues et documentées
(ex. CVE d'image de base tierce en attente de mise à jour amont).
