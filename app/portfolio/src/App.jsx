import './App.css'
import Reveal from './components/Reveal'
import Terminal from './components/Terminal'
import { useTypewriter } from './hooks/useTypewriter'

const ROLES = ['Ingénieur DevSecOps', 'Infrastructure as Code', 'Sécurité Kubernetes', 'GitOps & CI/CD']

const skills = [
  {
    title: 'Sécurité',
    items: ['Threat modeling', 'Durcissement (CIS, PodSecurity)', 'Gestion de secrets (Sealed Secrets, Vault)', 'SAST/SCA (Trivy, gitleaks, npm audit)'],
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
      "Plateforme Kubernetes auto-hébergée, entièrement pilotée en Infrastructure as Code : provisioning Terraform d'un cluster Talos Linux sur Proxmox, GitOps avec ArgoCD (webhook temps réel), HTTPS automatique (cert-manager + Let's Encrypt), et un pipeline CI/CD avec scans de sécurité intégrés. Ce site est lui-même déployé dessus, en continu.",
    tags: ['Terraform', 'Kubernetes', 'ArgoCD', 'GitHub Actions', 'DevSecOps'],
    link: 'https://github.com/gabriel25115CG/IAC-Homelab',
    status: 'En production',
  },
]

function App() {
  const typed = useTypewriter(ROLES)

  return (
    <>
      <div className="bg-grid" aria-hidden="true" />

      <header className="nav">
        <span className="nav-brand">
          GC<span className="cursor-dot" />
        </span>
        <nav>
          <a href="#about">à propos</a>
          <a href="#skills">compétences</a>
          <a href="#projects">projets</a>
          <a href="#contact">contact</a>
        </nav>
        <span className="status-chip">
          <span className="pulse" />
          disponible
        </span>
      </header>

      <main>
        <section className="hero">
          <div className="hero-text">
            <p className="eyebrow">
              <span className="prompt">&gt;</span> {typed}
              <span className="caret" />
            </p>
            <h1>
              Sécuriser et automatiser l'infrastructure,
              <br />
              du code jusqu'au cluster.
            </h1>
            <p className="lead">
              Diplômé de l'UTBM, je conçois des plateformes cloud/Kubernetes sûres
              par construction : infrastructure as code, GitOps, et sécurité
              intégrée directement dans le pipeline de déploiement.
            </p>
            <div className="cta">
              <a className="button primary" href="#projects">Voir mes projets</a>
              <a className="button" href="#contact">Me contacter</a>
            </div>
          </div>
          <Terminal />
        </section>

        <Reveal as="section" id="about" className="about">
          <span className="section-tag">01 · À propos</span>
          <h2>Qui je suis</h2>
          <p>
            Ingénieur DevSecOps diplômé de l'UTBM (Université de Technologie de
            Belfort-Montbéliard), je travaille à l'intersection de la sécurité
            et de l'infrastructure : automatiser sans jamais sacrifier la
            posture de sécurité, et sécuriser sans freiner la vélocité des
            équipes.
          </p>
        </Reveal>

        <section id="skills" className="skills">
          <Reveal as="span" className="section-tag">02 · Compétences</Reveal>
          <Reveal as="h2" delay={80}>Ce que je maîtrise</Reveal>
          <div className="skills-grid">
            {skills.map((group, i) => (
              <Reveal as="div" className="skill-card" key={group.title} delay={i * 100}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="projects" className="projects">
          <Reveal as="span" className="section-tag">03 · Projets</Reveal>
          <Reveal as="h2" delay={80}>Ce que j'ai construit</Reveal>
          {projects.map((project) => (
            <Reveal as="article" className="project-card" key={project.name} delay={160}>
              <div className="project-head">
                <h3>{project.name}</h3>
                <span className="live-badge">
                  <span className="pulse" />
                  {project.status}
                </span>
              </div>
              <p>{project.description}</p>
              <div className="tags">
                {project.tags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
              <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
                Voir le repo <span aria-hidden="true">→</span>
              </a>
            </Reveal>
          ))}
        </section>

        <Reveal as="section" id="contact" className="contact">
          <span className="section-tag">04 · Contact</span>
          <h2>Discutons</h2>
          <p>Disponible pour échanger sur un poste, une mission ou un projet.</p>
          <div className="cta">
            <a className="button primary" href="https://github.com/gabriel25115CG" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </Reveal>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Gabriel Chalmet — déployé via GitOps sur mon cluster Kubernetes.</p>
      </footer>
    </>
  )
}

export default App
