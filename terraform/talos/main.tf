# Sources consultées (siderolabs/talos ~0.9) :
#   https://registry.terraform.io/providers/siderolabs/talos/latest/docs/resources/machine_secrets
#   https://registry.terraform.io/providers/siderolabs/talos/latest/docs/data-sources/machine_configuration
#   https://registry.terraform.io/providers/siderolabs/talos/latest/docs/resources/machine_configuration_apply
#   https://registry.terraform.io/providers/siderolabs/talos/latest/docs/resources/machine_bootstrap
#   https://registry.terraform.io/providers/siderolabs/talos/latest/docs/data-sources/cluster_kubeconfig
#   https://registry.terraform.io/providers/siderolabs/talos/latest/docs/data-sources/client_configuration
#
# Lien avec terraform/proxmox : ce dossier ne connaît pas l'existence des VMs
# Proxmox (pas de dépendance terraform_remote_state). L'IP de chaque nœud est
# déterministe (calculée à partir des mêmes maps control_plane_nodes/worker_nodes
# que côté proxmox), donc les deux states peuvent être appliqués indépendamment
# tant que l'ordre ci-dessous (documenté dans terraform/README.md) est respecté :
#   1) apply ciblé ici (secrets + data sources + local_file) pour produire les
#      YAML dans terraform/talos/rendered/, consommés comme user-data Proxmox ;
#   2) apply complet de terraform/proxmox (crée les VMs avec ces YAML en user-data,
#      donc chaque VM boote déjà avec son IP statique finale) ;
#   3) apply complet ici (machine_configuration_apply + bootstrap + kubeconfig),
#      qui contacte les VMs maintenant démarrées sur leur IP statique.

locals {
  network_prefix = join(".", slice(split(".", var.network_gateway), 0, 3))

  control_plane_specs = {
    for name, octet in var.control_plane_nodes : name => {
      octet        = octet
      ip           = "${local.network_prefix}.${octet}"
      machine_type = "controlplane"
    }
  }

  worker_specs = {
    for name, octet in var.worker_nodes : name => {
      octet        = octet
      ip           = "${local.network_prefix}.${octet}"
      machine_type = "worker"
    }
  }

  all_node_specs = merge(local.control_plane_specs, local.worker_specs)

  cluster_endpoint = "https://${local.control_plane_specs[var.primary_control_plane_node].ip}:6443"
  primary_cp_ip     = local.control_plane_specs[var.primary_control_plane_node].ip
}

resource "talos_machine_secrets" "this" {
  talos_version = var.talos_version
}

# Une machine config complète par nœud (hostname + IP statique + route par défaut
# déjà patchés), pour qu'elle soit directement exploitable comme user-data nocloud
# au premier boot — voir commentaire en tête de fichier.
data "talos_machine_configuration" "this" {
  for_each = local.all_node_specs

  cluster_name     = var.cluster_name
  cluster_endpoint = local.cluster_endpoint
  machine_type     = each.value.machine_type
  machine_secrets  = talos_machine_secrets.this.machine_secrets
  talos_version    = var.talos_version

  config_patches = [
    yamlencode({
      machine = {
        network = {
          hostname = each.key
          interfaces = [
            {
              interface = "eth0"
              addresses = ["${each.value.ip}/${var.network_cidr_suffix}"]
              routes = [
                {
                  network = "0.0.0.0/0"
                  gateway = var.network_gateway
                }
              ]
            }
          ]
        }
      }
    })
  ]
}

resource "local_file" "rendered" {
  for_each = data.talos_machine_configuration.this

  filename        = "${path.module}/rendered/${each.key}.yaml"
  content         = each.value.machine_configuration
  file_permission = "0600"
}

resource "talos_machine_configuration_apply" "this" {
  for_each = local.all_node_specs

  client_configuration        = talos_machine_secrets.this.client_configuration
  machine_configuration_input = data.talos_machine_configuration.this[each.key].machine_configuration
  node                        = each.value.ip
  endpoint                    = each.value.ip
}

resource "talos_machine_bootstrap" "this" {
  client_configuration = talos_machine_secrets.this.client_configuration
  node                  = local.primary_cp_ip
  endpoint              = local.primary_cp_ip

  depends_on = [talos_machine_configuration_apply.this]
}

data "talos_client_configuration" "this" {
  cluster_name         = var.cluster_name
  client_configuration = talos_machine_secrets.this.client_configuration
  endpoints             = [for spec in local.control_plane_specs : spec.ip]
  nodes                 = [for spec in local.all_node_specs : spec.ip]
}

data "talos_cluster_kubeconfig" "this" {
  client_configuration = talos_machine_secrets.this.client_configuration
  node                  = local.primary_cp_ip

  depends_on = [talos_machine_bootstrap.this]
}
