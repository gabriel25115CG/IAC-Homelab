# Ce dossier a son propre state (backend local séparé de terraform/proxmox) : les
# maps de nœuds et le réseau sont donc redéfinis ici plutôt que partagés via
# terraform_remote_state. Garde ces valeurs en phase avec terraform/proxmox/variables.tf.

variable "cluster_name" {
  description = "Nom du cluster Talos/Kubernetes"
  type        = string
  default     = "homelab"
}

variable "primary_control_plane_node" {
  description = "Nom du nœud control-plane utilisé comme endpoint de cluster et pour le bootstrap"
  type        = string
  default     = "cp-01"
}

variable "talos_version" {
  description = "Version de Talos Linux (contrat de version pour la génération de machine config)"
  type        = string
  default     = "v1.8.2"
}

variable "network_gateway" {
  description = "Passerelle du réseau des VMs (doit correspondre à terraform/proxmox/variables.tf)"
  type        = string
  default     = "10.20.20.254"
}

variable "network_cidr_suffix" {
  description = "Suffixe CIDR du réseau des VMs"
  type        = number
  default     = 24
}

variable "control_plane_nodes" {
  description = "Définition des VMs control-plane : nom => dernier octet IP (doit correspondre à terraform/proxmox)"
  type        = map(number)
  default = {
    "cp-01" = 10
    "cp-02" = 11
    "cp-03" = 12
  }
}

variable "worker_nodes" {
  description = "Définition des VMs worker : nom => dernier octet IP (doit correspondre à terraform/proxmox)"
  type        = map(number)
  default = {
    "worker-01" = 20
    "worker-02" = 21
  }
}
