# Source consultée : https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs
# (v5.x renomme la ressource historique cloudflare_record en cloudflare_dns_record,
# avec un schema modifié — voir main.tf)

terraform {
  required_version = ">= 1.7.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
