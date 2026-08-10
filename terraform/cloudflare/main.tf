# proxied = false : le challenge DNS-01 de cert-manager (Let's Encrypt) et le TLS
# terminé par Traefik dans le cluster ont besoin de résoudre directement vers l'IP
# publique du homelab. Le proxy Cloudflare (orange cloud) interférerait avec la
# validation DNS-01 et masquerait l'IP réelle attendue par Traefik.
resource "cloudflare_dns_record" "wildcard" {
  zone_id = var.cloudflare_zone_id
  name    = "*.${var.domain}"
  type    = "A"
  content = var.public_ip_address
  ttl     = 300
  proxied = false
}
