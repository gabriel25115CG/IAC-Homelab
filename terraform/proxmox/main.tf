# Sources consultées (bpg/proxmox ~0.66) :
#   https://registry.terraform.io/providers/bpg/proxmox/latest/docs/resources/virtual_environment_download_file
#   https://registry.terraform.io/providers/bpg/proxmox/latest/docs/resources/virtual_environment_file
#   https://registry.terraform.io/providers/bpg/proxmox/latest/docs/resources/virtual_environment_vm
#
# Choix nocloud + user_data_file_id (snippet) plutôt que DHCP :
# l'image Talos "metal" attend une machine config appliquée après coup via talosctl
# (donc un premier boot en DHCP), alors que l'image "nocloud" est justement conçue
# pour lire sa machine config complète (avec machine.network déjà renseigné) comme
# user-data au tout premier boot. Cela permet à chaque VM de démarrer directement
# avec son IP statique 10.20.20.x, sans dépendre d'un bail DHCP ni d'une réservation
# côté routeur, et sans étape manuelle de talosctl apply-config réseau.
#
# Séquencement : ce fichier consomme les YAML rendus par terraform/talos
# (terraform/talos/rendered/<nom-noeud>.yaml), qui contiennent déjà la machine
# config Talos complète patchée avec hostname/IP/gateway. Voir terraform/README.md
# pour l'ordre d'apply exact entre terraform/talos et terraform/proxmox.

locals {
  # Schematic factory.talos.dev vide (aucune extension système) — voir commentaire
  # sur proxmox_virtual_environment_download_file.talos_nocloud ci-dessous.
  talos_schematic_id = "376567988ad370138ad8b2698212367b8edcb69b5fd68c80be1f2ec7d603b4ba"

  network_prefix = join(".", slice(split(".", var.network_gateway), 0, 3))

  control_plane_specs = {
    for name, octet in var.control_plane_nodes : name => {
      octet   = octet
      ip      = "${local.network_prefix}.${octet}"
      vcpu    = var.control_plane_vcpu
      memory  = var.control_plane_memory
      disk_gb = var.control_plane_disk_size
    }
  }

  worker_specs = {
    for name, octet in var.worker_nodes : name => {
      octet   = octet
      ip      = "${local.network_prefix}.${octet}"
      vcpu    = var.worker_vcpu
      memory  = var.worker_memory
      disk_gb = var.worker_disk_size
    }
  }

  all_node_specs = merge(local.control_plane_specs, local.worker_specs)
}

resource "proxmox_virtual_environment_download_file" "talos_nocloud" {
  content_type = "import"
  datastore_id = var.proxmox_iso_storage
  node_name    = var.proxmox_node
  url          = "https://factory.talos.dev/image/${local.talos_schematic_id}/${var.talos_version}/nocloud-amd64.raw.gz"
  file_name    = "talos-${var.talos_version}-nocloud-amd64.img"

  # L'ID de schematic ci-dessous correspond au schematic vide {"customization":{}}
  # généré via POST https://factory.talos.dev/schematics (aucune extension système
  # requise pour un cluster Talos standard avec pilotes virtio, déjà inclus dans nocloud).
  # Vérifié le 2026-08-10 : cet ID est stable tant que le schematic (vide) ne change pas.
  decompression_algorithm = "gz"
  overwrite               = false
}

resource "proxmox_virtual_environment_file" "user_data" {
  for_each = local.all_node_specs

  content_type = "snippets"
  datastore_id = var.proxmox_iso_storage
  node_name    = var.proxmox_node

  source_raw {
    file_name = "talos-${each.key}-user-data.yaml"
    data      = file("${path.module}/../talos/rendered/${each.key}.yaml")
  }
}

resource "proxmox_virtual_environment_vm" "control_plane" {
  for_each = local.control_plane_specs

  name      = each.key
  node_name = var.proxmox_node

  cpu {
    cores = each.value.vcpu
    type  = "host"
  }

  memory {
    dedicated = each.value.memory
  }

  disk {
    datastore_id = var.proxmox_storage
    interface    = "scsi0"
    size         = each.value.disk_gb
    file_format  = "raw"
    import_from  = proxmox_virtual_environment_download_file.talos_nocloud.id
  }

  network_device {
    bridge = var.network_bridge
  }

  operating_system {
    type = "l26"
  }

  initialization {
    datastore_id       = var.proxmox_storage
    user_data_file_id  = proxmox_virtual_environment_file.user_data[each.key].id

    ip_config {
      ipv4 {
        address = "${each.value.ip}/${var.network_cidr_suffix}"
        gateway = var.network_gateway
      }
    }
  }

  agent {
    enabled = false # Talos ne fait pas tourner le qemu-guest-agent par défaut
  }
}

resource "proxmox_virtual_environment_vm" "worker" {
  for_each = local.worker_specs

  name      = each.key
  node_name = var.proxmox_node

  cpu {
    cores = each.value.vcpu
    type  = "host"
  }

  memory {
    dedicated = each.value.memory
  }

  disk {
    datastore_id = var.proxmox_storage
    interface    = "scsi0"
    size         = each.value.disk_gb
    file_format  = "raw"
    import_from  = proxmox_virtual_environment_download_file.talos_nocloud.id
  }

  network_device {
    bridge = var.network_bridge
  }

  operating_system {
    type = "l26"
  }

  initialization {
    datastore_id      = var.proxmox_storage
    user_data_file_id = proxmox_virtual_environment_file.user_data[each.key].id

    ip_config {
      ipv4 {
        address = "${each.value.ip}/${var.network_cidr_suffix}"
        gateway = var.network_gateway
      }
    }
  }

  agent {
    enabled = false
  }
}
