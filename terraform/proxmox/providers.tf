terraform {
  required_version = ">= 1.7.0"

  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "~> 0.66"
    }
  }

  # Backend local par défaut. Si tu veux un state partagé/distant plus tard
  # (ex: pour que GitHub Actions applique sans avoir le state local),
  # remplace ce bloc par un backend "s3"-compatible (MinIO auto-hébergé,
  # Cloudflare R2, etc.) ou "http" (gitlab/terraform-http-backend).
  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "proxmox" {
  endpoint  = var.proxmox_api_url
  api_token = var.proxmox_api_token
  insecure  = var.proxmox_tls_insecure

  ssh {
    agent       = false
    username    = "root"
    private_key = file(pathexpand(var.proxmox_ssh_private_key_file))
  }
}
