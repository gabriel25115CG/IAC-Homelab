# Sources consultées :
#   https://registry.terraform.io/providers/siderolabs/talos/latest/docs
#   https://registry.terraform.io/providers/hashicorp/local/latest/docs

terraform {
  required_version = ">= 1.7.0"
  required_providers {
    talos = {
      source  = "siderolabs/talos"
      version = "~> 0.9"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }
  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "talos" {}
