import './App.css'

const skills = [
  {
    title: 'Sécurité',
    items: ['Threat modeling', 'Durcissement (CIS, PodSecurity)', 'Gestion de secrets (Sealed Secrets, Vault)', 'Scan SAST/SCA (Trivy, gitleaks, npm audit)'],
  },
  {
    title: 'Infrastructure & Cloud',
    items: ['Kubernetes', 'Terraform', 'Proxmox', 'Talos Linux', 'GitOps (ArgoCD)'],
  },
  {
    title: 'CI/CD & Développement',
    items: ['GitHub Actions', 'Docker', 'React / Node.js', 'Python', 'Bash'],
  },
]

const projects = [
  {
    name: 'IAC-Homelab',
    description:
      "Plateforme Kubernetes auto-hébergée, entièrement pilotée en Infrastructure as Code : provisioning Terraform d'un cluster Talos Linux sur Proxmox, GitOps avec ArgoCD, HTTPS automatique (cert-manager + Let's Encrypt), et un pipeline CI/CD avec scans de sécurité intégrés (secrets, dépendances, image Docker). Ce site est lui-même déployé dessus.",
    tags: ['Terraform', 'Kubernetes', 'ArgoCD', 'GitHub Actions', 'DevSecOps'],
    link: 'https://github.com/gabriel25115CG/IAC-Homelab',
  },
]

function App() {
  return (
    <>
      <header className="nav">
        <span className="nav-brand">Gabriel Chalmet</span>
        <nav>
          <a href="#about">À propos</a>
          <a href="#skills">Compétences</a>
          <a href="#projects">Projets</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow">Ingénieur DevSecOps</p>
          <h1>Sécuriser et automatiser l'infrastructure, du code jusqu'au cluster.</h1>
          <p className="lead">
            Diplômé de l'UTBM, je conçois des plateformes cloud/Kubernetes sûres
            par construction : infrastructure as code, GitOps, et sécurité
            intégrée directement dans le pipeline de déploiement.
          </p>
          <div className="cta">
            <a className="button primary" href="#projects">Voir mes projets</a>
            <a className="button" href="#contact">Me contacter</a>
          </div>
        </section>

        <section id="about" className="about">
          <h2>À propos</h2>
          <p>
            Ingénieur DevSecOps diplômé de l'UTBM (Université de Technologie de
            Belfort-Montbéliard), je travaille à l'intersection de la sécurité
            et de l'infrastructure : automatiser sans jamais sacrifier la
            posture de sécurité, et sécuriser sans freiner la vélocité des
            équipes.
          </p>
        </section>

        <section id="skills" className="skills">
          <h2>Compétences</h2>
          <div className="skills-grid">
            {skills.map((group) => (
              <div className="skill-card" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="projects">
          <h2>Projets</h2>
          {projects.map((project) => (
            <article className="project-card" key={project.name}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="tags">
                {project.tags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
              <a href={project.link} target="_blank" rel="noreferrer">
                Voir le repo →
              </a>
            </article>
          ))}
        </section>

        <section id="contact" className="contact">
          <h2>Contact</h2>
          <p>Disponible pour échanger sur un poste, une mission ou un projet.</p>
          <div className="cta">
            <a className="button primary" href="mailto:gabriel.chalmet@arrive.com">
              gabriel.chalmet@arrive.com
            </a>
            <a className="button" href="https://github.com/gabriel25115CG" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Gabriel Chalmet</p>
      </footer>
    </>
  )
}

export default App
