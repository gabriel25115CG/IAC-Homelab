import './App.css'
import Reveal from './components/Reveal'
import Highlights from './components/Highlights'
import { useTypewriter } from './hooks/useTypewriter'

const ROLES = ["Conseillère Principale d'Éducation", "Titulaire d'un Master MEEF", 'Engagée pour le bien-être des élèves']

const skills = [
  {
    title: 'Vie scolaire & accompagnement',
    items: [
      "Suivi de l'assiduité et des retards",
      'Gestion et médiation de conflits',
      'Écoute active et accompagnement individualisé',
      "Coordination d'une équipe de vie scolaire",
    ],
  },
  {
    title: 'Prévention & sensibilisation',
    items: [
      'Actions de prévention du harcèlement scolaire',
      'Sensibilisation à la citoyenneté',
      'Conception de supports pédagogiques (vidéos)',
      'Travail en lien avec les familles',
    ],
  },
  {
    title: 'Compétences transverses',
    items: [
      "Rigueur et sens de l'organisation",
      'Travail en équipe pluri-professionnelle',
      'Communication bienveillante',
      "Gestion du stress et de l'urgence",
    ],
  },
]

const experiences = [
  {
    company: 'Lycée Raoul Follereau, Belfort',
    role: 'Conseillère Principale d\'Éducation',
    period: 'Depuis 2026',
    highlights: [
      "Accompagnement du quotidien des élèves : vie scolaire, suivi de l'assiduité, écoute et médiation",
      'Élaboration et mise en œuvre d\'actions de prévention (harcèlement, citoyenneté, bien-être)',
      "Coordination de l'équipe de vie scolaire",
    ],
    tags: ['Vie scolaire', 'Prévention', 'Médiation'],
  },
  {
    company: 'Lycée du Luxembourg, Vesoul',
    role: 'CPE Stagiaire',
    period: '2025 - 2026',
    highlights: [
      'Première expérience de terrain en vie scolaire, en responsabilité progressive',
      "Gestion des conflits et suivi individualisé d'élèves",
      'Participation à des actions de sensibilisation au harcèlement scolaire',
    ],
    tags: ['Vie scolaire', 'Accompagnement', 'Sensibilisation'],
  },
  {
    company: 'CHU de Besançon',
    role: 'Brancardière (job étudiant)',
    period: '2022',
    highlights: [
      "Accompagnement et transport des patients au sein de l'établissement",
      'Travail en coordination avec les équipes soignantes',
    ],
    tags: ['Job étudiant', 'Milieu hospitalier'],
  },
  {
    company: 'Clinique Saint Vincent',
    role: 'Agent de stérilisation (job étudiant)',
    period: '2023',
    highlights: [
      'Stérilisation du matériel médico-chirurgical selon les protocoles d\'hygiène',
      'Rigueur et respect strict des procédures',
    ],
    tags: ['Job étudiant', 'Milieu hospitalier'],
  },
]

const formation = ["Master MEEF - Métiers de l'Enseignement, de l'Éducation et de la Formation"]

const projects = [
  {
    name: 'Vidéos de prévention contre le harcèlement scolaire',
    description:
      "Conception et réalisation de courtes vidéos de sensibilisation destinées aux élèves, dans une démarche de prévention du harcèlement et de promotion d'un climat scolaire bienveillant.",
    tags: ['Prévention', 'Pédagogie', 'Vidéo'],
    status: 'Projet pédagogique',
  },
]

function App() {
  const typed = useTypewriter(ROLES)

  return (
    <>
      <div className="bg-grid" aria-hidden="true" />

      <header className="nav">
        <span className="nav-brand">
          Judith Allemann
        </span>
        <nav>
          <a href="#about">à propos</a>
          <a href="#experience">expérience</a>
          <a href="#skills">compétences</a>
          <a href="#projects">projets</a>
        </nav>
        <span className="status-chip">
          <span className="cursor-dot" />
          Belfort
        </span>
      </header>

      <main>
        <section className="hero">
          <div className="hero-text">
            <p className="eyebrow">
              {typed}
              <span className="caret" />
            </p>
            <h1>
              Accompagner, écouter et construire
              <br />
              un cadre de vie scolaire serein.
            </h1>
            <p className="lead">
              Conseillère Principale d'Éducation, je place l'écoute et la
              prévention au cœur de mon accompagnement des élèves, dans une
              vie scolaire bienveillante et structurée.
            </p>
            <div className="cta">
              <a className="button primary" href="#experience">Voir mon parcours</a>
              <a className="button" href="#projects">Mes projets</a>
            </div>
          </div>
          <Highlights />
        </section>

        <Reveal as="section" id="about" className="about">
          <span className="section-tag">À propos</span>
          <h2>Qui je suis</h2>
          <p>
            Titulaire d'un Master MEEF (Métiers de l'Enseignement, de
            l'Éducation et de la Formation), je me suis spécialisée dans
            l'accompagnement éducatif et la vie scolaire. Mon rôle de CPE me
            place au cœur du quotidien des élèves : suivi de l'assiduité,
            gestion des conflits, écoute, et mise en place d'actions de
            prévention autour du harcèlement, du bien-être et de la
            citoyenneté.
          </p>
        </Reveal>

        <section id="experience" className="experience">
          <Reveal as="span" className="section-tag">Expérience</Reveal>
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
          <Reveal as="span" className="section-tag">Compétences</Reveal>
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
            <span className="certifications-label">Formation</span>
            <div className="tags">
              {formation.map((f) => (
                <span className="tag" key={f}>{f}</span>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="projects" className="projects">
          <Reveal as="span" className="section-tag">Projets</Reveal>
          <Reveal as="h2" delay={80}>Ce que j'ai construit</Reveal>
          {projects.map((project) => (
            <Reveal as="article" className="project-card" key={project.name} delay={160}>
              <div className="project-head">
                <h3>{project.name}</h3>
                <span className="live-badge">{project.status}</span>
              </div>
              <p>{project.description}</p>
              <div className="tags">
                {project.tags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Judith Allemann · Conseillère Principale d'Éducation</p>
      </footer>
    </>
  )
}

export default App
