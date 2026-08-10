# kubeconfig et talosconfig contiennent des identifiants d'accès au cluster :
# ne JAMAIS les committer (fichiers générés par `terraform output`, à traiter
# comme des secrets, au même titre que terraform.tfstate de ce dossier).

output "kubeconfig" {
  description = "Kubeconfig brut du cluster (à écrire dans un fichier local, hors dépôt)"
  value       = data.talos_cluster_kubeconfig.this.kubeconfig_raw
  sensitive   = true
}

output "talosconfig" {
  description = "Talosconfig brut du cluster (à écrire dans un fichier local, hors dépôt)"
  value       = data.talos_client_configuration.this.talos_config
  sensitive   = true
}
