# terraform/

Trois states indépendants (chacun a son propre backend local) :

- `talos/` — secrets et machine configs Talos
- `proxmox/` — VMs Talos sur Proxmox
- `cloudflare/` — enregistrement DNS wildcard

## Ordre d'apply (provisionnement initial du cluster)

`terraform/proxmox` a besoin des machine configs Talos déjà rendues en YAML
(`terraform/talos/rendered/*.yaml`) comme user-data pour que chaque VM démarre
directement avec son IP statique (pas de DHCP). `terraform/talos` a ensuite
besoin des VMs démarrées pour pouvoir leur appliquer la config finale et
bootstrapper le cluster. D'où une séquence en trois passes :

```sh
# 1) Génère les YAML de machine config (secrets + data sources + local_file
#    uniquement — les ressources qui contactent une VM réelle échoueraient
#    puisqu'aucune VM n'existe encore).
cd terraform/talos
terraform init
terraform apply \
  -target=talos_machine_secrets.this \
  -target=data.talos_machine_configuration.this \
  -target=local_file.rendered

# 2) Crée les VMs Proxmox, qui bootent directement sur leur IP statique en
#    lisant les YAML générés à l'étape 1 comme user-data nocloud.
cd ../proxmox
terraform init
terraform apply

# 3) Applique la config finale sur les VMs maintenant démarrées, bootstrap
#    le control-plane cp-01, puis récupère kubeconfig/talosconfig.
cd ../talos
terraform apply
```

Les runs suivants (changement de machine config, ajout d'un nœud, etc.)
peuvent se faire avec un simple `terraform apply` dans chaque dossier
concerné, dans le même ordre (talos → proxmox → talos) si la topologie des
nœuds change.

## Cloudflare

Indépendant du reste — à appliquer une fois l'IP publique connue :

```sh
cd terraform/cloudflare
terraform init
terraform apply
```

## Secrets

- `terraform.tfvars` (tous dossiers) et `terraform/talos/terraform.tfstate*`
  contiennent des secrets — ne jamais les committer.
- Les outputs `kubeconfig` et `talosconfig` de `terraform/talos` sont
  sensitive ; extraire leur contenu avec `terraform output -raw` et écrire le
  résultat dans un fichier local hors dépôt.
