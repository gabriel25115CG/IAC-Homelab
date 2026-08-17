import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <section id="center">
      <h1>Gabriel — Portfolio</h1>
      <p>Déployé via GitOps depuis le repo IAC-Homelab sur mon cluster K8s homelab.</p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Compteur de test : {count}
      </button>
    </section>
  )
}

export default App
