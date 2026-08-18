export default function ArchitectureDiagram() {
  return (
    <svg
      className="architecture-diagram"
      viewBox="0 0 1000 660"
      role="img"
      aria-label="Schéma d'architecture : push GitHub déclenche la CI (build, scan, push image), ArgoCD synchronise le cluster Kubernetes (Talos) via GitOps sur un serveur physique HP ProLiant G8 exécutant Proxmox, exposé derrière un firewall Netgate SG4860 qui route le trafic HTTPS vers l'utilisateur."
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="diagram-arrowhead" />
        </marker>
      </defs>

      {/* --- flèches --- */}
      <path d="M200,62 H260" className="diagram-edge" markerEnd="url(#arrow)" />
      <path d="M460,62 H760" className="diagram-edge" markerEnd="url(#arrow)" />
      <path d="M360,94 Q235,150 110,94" className="diagram-edge diagram-edge-dashed" markerEnd="url(#arrow)" />
      <path d="M110,94 V200" className="diagram-edge" markerEnd="url(#arrow)" />
      <path d="M200,232 H260" className="diagram-edge diagram-edge-accent" markerEnd="url(#arrow)" />
      <path d="M850,300 V94" className="diagram-edge diagram-edge-dashed" markerEnd="url(#arrow)" />
      <path d="M355,300 V510" className="diagram-edge diagram-edge-accent" markerEnd="url(#arrow)" />
      <path d="M390,564 V595" className="diagram-edge diagram-edge-accent" markerEnd="url(#arrow)" />

      {/* --- labels de flèches --- */}
      <text x="230" y="52" className="diagram-edge-label">push</text>
      <text x="610" y="52" className="diagram-edge-label">image</text>
      <text x="235" y="145" className="diagram-edge-label">bump tag</text>
      <text x="118" y="150" className="diagram-edge-label">webhook</text>
      <text x="230" y="222" className="diagram-edge-label">sync</text>
      <text x="858" y="190" className="diagram-edge-label">pull image</text>
      <text x="363" y="440" className="diagram-edge-label">TLS (443)</text>
      <text x="398" y="583" className="diagram-edge-label">HTTPS</text>

      {/* --- GitHub repo --- */}
      <g>
        <rect x="20" y="30" width="180" height="64" rx="10" className="diagram-node" />
        <text x="110" y="57" className="diagram-node-title" textAnchor="middle">GitHub</text>
        <text x="110" y="76" className="diagram-node-sub" textAnchor="middle">repo (monorepo)</text>
      </g>

      {/* --- GitHub Actions --- */}
      <g>
        <rect x="260" y="30" width="200" height="64" rx="10" className="diagram-node" />
        <text x="360" y="53" className="diagram-node-title" textAnchor="middle">GitHub Actions</text>
        <text x="360" y="71" className="diagram-node-sub" textAnchor="middle">build · gitleaks</text>
        <text x="360" y="86" className="diagram-node-sub" textAnchor="middle">npm audit · trivy</text>
      </g>

      {/* --- GHCR --- */}
      <g>
        <rect x="760" y="30" width="180" height="64" rx="10" className="diagram-node" />
        <text x="850" y="57" className="diagram-node-title" textAnchor="middle">GHCR</text>
        <text x="850" y="76" className="diagram-node-sub" textAnchor="middle">registre d'images</text>
      </g>

      {/* --- ArgoCD --- */}
      <g>
        <rect x="20" y="200" width="180" height="64" rx="10" className="diagram-node diagram-node-accent" />
        <text x="110" y="227" className="diagram-node-title" textAnchor="middle">ArgoCD</text>
        <text x="110" y="246" className="diagram-node-sub" textAnchor="middle">GitOps sync</text>
      </g>

      {/* --- Matériel physique (conteneur externe) --- */}
      <g>
        <rect x="240" y="170" width="720" height="310" rx="14" className="diagram-hardware" />
        <text x="262" y="196" className="diagram-hardware-title">🖥 HP ProLiant G8 · Proxmox VE</text>

        {/* --- Cluster K8s (conteneur interne) --- */}
        <rect x="260" y="210" width="680" height="250" rx="12" className="diagram-cluster" />
        <text x="280" y="234" className="diagram-cluster-title">Cluster Kubernetes · Talos Linux (VMs)</text>

        <rect x="280" y="250" width="150" height="50" rx="8" className="diagram-node diagram-node-sm" />
        <text x="355" y="280" className="diagram-node-title diagram-node-title-sm" textAnchor="middle">Traefik</text>

        <rect x="450" y="250" width="150" height="50" rx="8" className="diagram-node diagram-node-sm" />
        <text x="525" y="280" className="diagram-node-title diagram-node-title-sm" textAnchor="middle">cert-manager</text>

        <rect x="620" y="250" width="140" height="50" rx="8" className="diagram-node diagram-node-sm" />
        <text x="690" y="280" className="diagram-node-title diagram-node-title-sm" textAnchor="middle">Longhorn</text>

        <rect x="780" y="250" width="140" height="50" rx="8" className="diagram-node diagram-node-sm" />
        <text x="850" y="274" className="diagram-node-title diagram-node-title-sm" textAnchor="middle">Apps</text>
        <text x="850" y="289" className="diagram-node-sub" textAnchor="middle">portfolio · links</text>

        <rect x="280" y="330" width="640" height="110" rx="8" className="diagram-node diagram-node-sm" />
        <text x="600" y="353" className="diagram-node-title diagram-node-title-sm" textAnchor="middle">Prometheus · Grafana · Sealed Secrets</text>
        <text x="600" y="372" className="diagram-node-sub" textAnchor="middle">monitoring & secrets chiffrés</text>
        <text x="600" y="391" className="diagram-node-sub" textAnchor="middle">MetalLB (LoadBalancer L2)</text>
      </g>

      {/* --- Netgate SG4860 --- */}
      <g>
        <rect x="280" y="510" width="220" height="54" rx="10" className="diagram-node diagram-node-hw" />
        <text x="390" y="533" className="diagram-node-title" textAnchor="middle">Netgate SG4860 (1U)</text>
        <text x="390" y="550" className="diagram-node-sub" textAnchor="middle">firewall · NAT 80/443</text>
      </g>

      {/* --- Internet / utilisateur --- */}
      <g>
        <rect x="270" y="595" width="250" height="50" rx="10" className="diagram-node diagram-node-accent" />
        <text x="395" y="625" className="diagram-node-title" textAnchor="middle">Utilisateur (Internet)</text>
      </g>
    </svg>
  )
}
