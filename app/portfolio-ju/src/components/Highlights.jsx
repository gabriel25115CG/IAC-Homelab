import { useReveal } from '../hooks/useReveal'

const ITEMS = [
  { icon: '🎓', label: 'Master MEEF', detail: "Métiers de l'Enseignement, de l'Éducation et de la Formation" },
  { icon: '🏫', label: 'CPE', detail: 'Lycée Raoul Follereau, Belfort' },
  { icon: '💛', label: 'Prévention', detail: 'Bien-être et climat scolaire des élèves' },
]

export default function Highlights() {
  const [ref, visible] = useReveal(0.3)

  return (
    <div ref={ref} className="highlights-card">
      {ITEMS.map((item, i) => (
        <div
          key={item.label}
          className={`highlight-row ${visible ? 'highlight-row-visible' : ''}`}
          style={{ transitionDelay: visible ? `${i * 140}ms` : '0ms' }}
        >
          <span className="highlight-icon" aria-hidden="true">{item.icon}</span>
          <div>
            <p className="highlight-label">{item.label}</p>
            <p className="highlight-detail">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
