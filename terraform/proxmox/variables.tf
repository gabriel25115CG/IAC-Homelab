variable "proxmox_api_url" {
  description = "URL de l'API Proxmox, ex: https://node-01.labo.priv:8006/"
  type        = string
}

variable "proxmox_api_token" {
  description = "Token API Proxmox au format 'terraform@pve!terraform-token=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'"
  type        = string
  sensitive   = true
}

variable "proxmox_tls_insecure" {
  description = "Ignorer la vérification TLS (true si certificat auto-signé Proxmox par défaut)"
  type        = bool
  default     = true
}

variable "proxmox_ssh_private_key_file" {
  description = "Chemin vers la clé privée SSH pour l'accès root à l'hôte Proxmox (le provider en a besoin pour l'upload de snippets et l'import d'images, l'API seule ne suffit pas)"
  type        = string
  default     = "~/.ssh/proxmox_terraform_ed25519"
}

variable "proxmox_node" {
  description = "Nom du nœud Proxmox cible (visible dans l'UI Proxmox, ex: node-01)"
  type        = string
  default     = "node-01"
}

variable "proxmox_storage" {
  description = "Nom du storage Proxmox pour les disques des VMs (ex: local-lvm)"
  type        = string
  default     = "local-lvm"
}

variable "proxmox_iso_storage" {
  description = "Nom du storage Proxmox pour l'image Talos téléchargée (doit supporter le type 'iso' ou 'import')"
  type        = string
  default     = "local"
}

variable "network_bridge" {
  description = "Bridge réseau Proxmox à utiliser pour les VMs"
  type        = string
  default     = "vmbr1"
}

variable "network_gateway" {
  description = "Passerelle du réseau des VMs"
  type        = string
  default     = "10.20.20.254"
}

variable "network_cidr_suffix" {
  description = "Suffixe CIDR du réseau des VMs"
  type        = number
  default     = 24
}

variable "talos_version" {
  description = "Version de Talos Linux à déployer"
  type        = string
  default     = "v1.8.2"
}

variable "control_plane_nodes" {
  description = "Définition des VMs control-plane : nom => dernier octet IP"
  type        = map(number)
  default = {
    "cp-01" = 10
    "cp-02" = 11
    "cp-03" = 12
  }
}

variable "worker_nodes" {
  description = "Définition des VMs worker : nom => dernier octet IP"
  type        = map(number)
  default = {
    "worker-01" = 20
    "worker-02" = 21
  }
}

variable "control_plane_vcpu" {
  type    = number
  default = 2
}

variable "control_plane_memory" {
  description = "RAM en Mo"
  type        = number
  default     = 4096
}

variable "control_plane_disk_size" {
  description = "Taille disque en Go"
  type        = number
  default     = 40
}

variable "worker_vcpu" {
  type    = number
  default = 4
}

variable "worker_memory" {
  description = "RAM en Mo"
  type        = number
  default     = 16384
}

variable "worker_disk_size" {
  description = "Taille disque en Go"
  type        = number
  default     = 100
}
