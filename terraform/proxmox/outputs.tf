output "control_plane_ips" {
  description = "IP LAN de chaque VM control-plane (nom => IP)"
  value       = { for name, spec in local.control_plane_specs : name => spec.ip }
}

output "worker_ips" {
  description = "IP LAN de chaque VM worker (nom => IP)"
  value       = { for name, spec in local.worker_specs : name => spec.ip }
}
