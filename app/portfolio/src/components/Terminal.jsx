import { useEffect, useState } from 'react'
import { useReveal } from '../hooks/useReveal'

const SCRIPT = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: 'gabriel.chalmet — ingénieur devsecops' },
  { type: 'cmd', text: 'trivy image ghcr.io/gabriel25115cg/portfolio' },
  { type: 'out', text: '0 critical, 0 high vulnerabilities found', ok: true },
  { type: 'cmd', text: 'kubectl get pods -n portfolio' },
  { type: 'out', text: 'portfolio-578849b99b-d9g88   1/1   Running' },
  { type: 'cmd', text: 'echo $?' },
  { type: 'out', text: '0', ok: true },
]

export default function Terminal() {
  const [ref, visible] = useReveal(0.4)
  const [lines, setLines] = useState([])
  const [typed, setTyped] = useState('')

  useEffect(() => {
    if (!visible) return undefined

    let cancelled = false
    let lineIndex = 0

    const runLine = () => {
      if (cancelled || lineIndex >= SCRIPT.length) return
      const line = SCRIPT[lineIndex]

      if (line.type === 'out') {
        setLines((prev) => [...prev, line])
        setTyped('')
        lineIndex += 1
        setTimeout(runLine, 500)
        return
      }

      let charIndex = 0
      const typeChar = () => {
        if (cancelled) return
        if (charIndex <= line.text.length) {
          setTyped(line.text.slice(0, charIndex))
          charIndex += 1
          setTimeout(typeChar, 35)
        } else {
          setLines((prev) => [...prev, line])
          setTyped('')
          lineIndex += 1
          setTimeout(runLine, 400)
        }
      }
      typeChar()
    }

    const start = setTimeout(runLine, 400)
    return () => {
      cancelled = true
      clearTimeout(start)
    }
  }, [visible])

  const isTypingCmd = typed !== '' && lines.length < SCRIPT.length && SCRIPT[lines.length]?.type === 'cmd'

  return (
    <div ref={ref} className="terminal">
      <div className="terminal-bar">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <span className="terminal-title">gabriel@homelab: ~/portfolio</span>
      </div>
      <div className="terminal-body">
        {lines.map((line, i) => (
          <div key={i} className={`term-line ${line.type} ${line.ok ? 'ok' : ''}`}>
            {line.type === 'cmd' ? <span className="prompt">$</span> : null}
            {line.text}
          </div>
        ))}
        {isTypingCmd && (
          <div className="term-line cmd">
            <span className="prompt">$</span>
            {typed}
            <span className="caret" />
          </div>
        )}
      </div>
    </div>
  )
}
