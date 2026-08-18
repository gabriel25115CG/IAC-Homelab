import './App.css'
import Reveal from './components/Reveal'
import Terminal from './components/Terminal'
import ArchitectureDiagram from './components/ArchitectureDiagram'
import { useTypewriter } from './hooks/useTypewriter'

const ROLES = ['Ingénieur Cybersécurité', 'SOC & Threat Detection', 'Forensic & Incident Response', 'Sécurité réseau']

const skills = [
  {
    title: 'Sécurité & SOC',
    items: [
      "Gestion des alertes et incidents de sécurité",
      "Mise en place et gestion d'un SOC 24/7",
      'Forensic & Incident Response',
      'Gestion des vulnérabilités et exposition des assets',
      'Sensibilisation des utilisateurs à la sécurité',
    ],
  },
  {
    title: 'Réseau & Infrastructure',
    items: [
      'Administration réseau',
      'Cluster de pare-feu (Pfsense)',
      'Data Loss Prevention (DLP)',
      'Veille technologique cyber',
    ],
  },
  {
    title: 'SIEM & Détection',
    items: ['SentinelOne', 'ELK Stack', 'Splunk Cloud', 'IOC / IOA'],
  },
  {
    title: 'Outils & IA',
    items: ['XMCO', 'Yuno (veille cyber)', 'Meta Compliance', 'Intelligence artificielle (IA)'],
  },
]

const experiences = [
  {
    company: 'Arrive (Flowbird / EasyPark)',
    role: 'Apprenti Ingénieur Cybersécurité',
    period: 'Septembre 2023 - Août 2026',
    highlights: [
      "Traitement et investigation d'alertes de sécurité (CTI, EDR, SIEM, DLP), gestion d'incidents et cellules de crise",
      "Mise en place d'une infrastructure de Threat Forensic pour des investigations post-incident en environnement contrôlé",
      "Contribution à la mise en place d'un SOC 24/7 externalisé : cartographie des assets, use cases, MCO",
      "Implémentation ISO 27001 (procédures, mise en conformité)",
      'Pipeline de données Airflow/Snowflake + plugin Backstage pour les KPIs de sensibilisation phishing (Knowbe4)',
    ],
    tags: ['SentinelOne', 'Splunk Cloud', 'XMCO', 'Airflow', 'Snowflake', 'AWS', 'GCP'],
  },
  {
    company: 'Abéo',
    role: 'Apprenti Administrateur Réseau & Sécurité',
    period: 'Septembre 2022 - Août 2023',
    highlights: [
      "Mise en place d'un cluster de pare-feu Pfsense (cœur de réseau interconnectant les filiales via tunnels IPSec)",
      'SIEM basé sur la stack ELK pour l\'archivage et la détection sur ~20 firewalls du groupe',
      'Support utilisateurs niveaux 1 & 2 (postes, réseaux, logiciels métier)',
    ],
    tags: ['Pfsense', 'ELK Stack', 'Windows Server', 'Ubuntu Server'],
  },
]

const certifications = ['Google Cloud Cybersecurity Certificate', 'Linguaskill Business (Cambridge)']

const projects = [
  {
    name: 'IAC-Homelab',
    description:
      "Plateforme Kubernetes auto-hébergée, entièrement pilotée en Infrastructure as Code : provisioning Terraform d'un cluster Talos Linux sur Proxmox, GitOps avec ArgoCD (webhook temps réel), HTTPS automatique (cert-manager + Let's Encrypt), monitoring (Prometheus/Grafana), et un pipeline CI/CD avec scans de sécurité intégrés. Ce site est lui-même déployé dessus, en continu.",
    tags: ['Terraform', 'Kubernetes', 'ArgoCD', 'GitHub Actions', 'Sécurité'],
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
          <a href="#experience">expérience</a>
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
              Détecter, investiguer et sécuriser
              <br />
              les systèmes d'information.
            </h1>
            <p className="lead">
              Diplômé de l'UTBM en Réseaux et Cybersécurité, j'opère au
              quotidien la détection et la réponse à incident (SOC, SIEM,
              forensic), et j'automatise la sécurité jusque dans mes
              projets personnels.
            </p>
            <div className="cta">
              <a className="button primary" href="#experience">Voir mon parcours</a>
              <a className="button" href="#contact">Me contacter</a>
            </div>
          </div>
          <Terminal />
        </section>

        <Reveal as="section" id="about" className="about">
          <span className="section-tag">01 · À propos</span>
          <h2>Qui je suis</h2>
          <p>
            Ingénieur en informatique diplômé de l'UTBM (Université de
            Technologie de Belfort-Montbéliard) en août 2026, spécialisé en
            Réseaux et Cybersécurité. Passionné par la cybersécurité et les
            nouvelles technologies, j'ai eu l'opportunité de travailler au
            sein de grands groupes internationaux, ce qui m'a permis de
            développer mes compétences techniques et d'évoluer dans des
            environnements professionnels exigeants.
          </p>
          <p style={{ marginTop: 16 }}>
            En dehors de l'informatique, je suis passionné de musique et de
            trail, deux activités qui reflètent mon goût pour la
            créativité, le dépassement de soi et les nouveaux défis.
          </p>
        </Reveal>

        <section id="experience" className="experience">
          <Reveal as="span" className="section-tag">02 · Expérience</Reveal>
          <Reveal as="h2" delay={80}>Mon parcours</Reveal>
          <div className="timeline">
            {experiences.map((exp, i) => (
              <Reveal as="article" className="timeline-item" key={exp.company} delay={i * 120}>
                <div className="timeline-head">
                  <h3>{exp.role}</h3>
                  <span className="timeline-period">{exp.period}</span>
                </div>
                <p className="timeline-company">{exp.company}</p>
                <ul>
                  {exp.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <div className="tags">
                  {exp.tags.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="skills" className="skills">
          <Reveal as="span" className="section-tag">03 · Compétences</Reveal>
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
          <Reveal className="certifications" delay={200}>
            <span className="certifications-label">Certifications</span>
            <div className="tags">
              {certifications.map((cert) => (
                <span className="tag" key={cert}>{cert}</span>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="projects" className="projects">
          <Reveal as="span" className="section-tag">04 · Projets</Reveal>
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
          <Reveal delay={220} className="architecture-wrap">
            <ArchitectureDiagram />
          </Reveal>
        </section>

        <Reveal as="section" id="contact" className="contact">
          <span className="section-tag">05 · Contact</span>
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
        <p>© {new Date().getFullYear()} Gabriel Chalmet · déployé via GitOps sur mon cluster Kubernetes.</p>
      </footer>
    </>
  )
}

export default App
