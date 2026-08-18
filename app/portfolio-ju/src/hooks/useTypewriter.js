import { useEffect, useState } from 'react'

// Fait défiler une liste de chaînes : tape, attend, efface, passe à la
// suivante. Boucle indéfiniment.
export function useTypewriter(words, { typingMs = 55, pauseMs = 1600, deletingMs = 30 } = {}) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    const current = words[index % words.length]
    let timeout

    if (phase === 'typing') {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typingMs)
      } else {
        timeout = setTimeout(() => setPhase('pausing'), pauseMs)
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), pauseMs)
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), deletingMs)
      } else {
        setIndex((i) => i + 1)
        setPhase('typing')
      }
    }

    return () => clearTimeout(timeout)
  }, [text, phase, index, words, typingMs, pauseMs, deletingMs])

  return text
}
