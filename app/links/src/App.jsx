import './App.css'

const links = [
  { label: 'Portfolio', href: 'https://portfolio.gabriel0day.cloud' },
  { label: 'GitHub', href: 'https://github.com/gabriel25115CG' },
  { label: 'Homelab (IAC-Homelab)', href: 'https://github.com/gabriel25115CG/IAC-Homelab' },
]

function App() {
  return (
    <main className="card">
      <div className="avatar" aria-hidden="true">GC</div>
      <h1>Gabriel Chalmet</h1>
      <p className="subtitle">Ingénieur DevSecOps</p>
      <ul className="links">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
