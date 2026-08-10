variable "cloudflare_api_token" {
  description = "Token API Cloudflare avec permission DNS:Edit sur la zone"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "ID de la zone Cloudflare pour le domaine"
  type        = string
}

variable "public_ip_address" {
  description = "IP publique statique de la box/routeur exposant le cluster"
  type        = string
}

variable "domain" {
  description = "Nom de domaine géré sur Cloudflare"
  type        = string
  default     = "gabriel0day.cloud"
}
