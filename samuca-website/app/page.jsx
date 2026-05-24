'use client'

import { useEffect, useState } from 'react'

export default function Page() {
  const [activeAccordion, setActiveAccordion] = useState(null)
  const [typedText, setTypedText] = useState('')

  const textToType = "Desenvolvedor de 15 anos, especialista em segurança defensiva e Screen Share."

  useEffect(() => {
    let i = 0
    let timeoutId

    const typeWriter = () => {
      if (i < textToType.length) {
        setTypedText(prev => prev + textToType.charAt(i))
        i++
        const speed = Math.random() * 30 + 20
        timeoutId = setTimeout(typeWriter, speed)
      }
    }

    const initialDelay = setTimeout(typeWriter, 800)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(initialDelay)
    }
  }, [])

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  return (
    <main className="container">
      <header className="hero">
        <div className="hero-badge">
          <span className="pulse-dot"></span>
          Segurança & Anti-Cheat
        </div>
        <h1 className="hero-title">
          Muito prazer,<br />
          <span className="gradient-text glitch-hover">o Samuca sou eu.</span>
        </h1>
        <div className="hero-subtitle-container">
          <span className="hero-subtitle">{typedText}</span>
          <span className="cursor"></span>
        </div>
        
        <div className="bible-verse slide-up">
          "Tudo posso naquele que me fortalece." <span className="verse-ref">— Filipenses 4:13</span>
        </div>
      </header>

      <section className="accordion slide-up delay-1">
        {/* Item 1 */}
        <div className={`accordion-item ${activeAccordion === 0 ? 'active' : ''}`}>
          <button className="accordion-header" onClick={() => toggleAccordion(0)}>
            <h2>Quem é Samuca?</h2>
            <svg className="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div className="accordion-content">
            <div className="accordion-inner">
              <div className="accordion-inner-content">
                <p>Movido por grandes propósitos, Samuca estuda e trabalha diariamente para se tornar uma das maiores referências em desenvolvimento de Anti-Cheat (AC) e o especialista em Screen Share (SS) mais respeitado do Brasil.</p>
                <p>Com apenas 15 anos e domínio de métodos privados, ele transita com facilidade pelo desenvolvimento de software de baixo nível e web, dominando tecnologias como C#, C++, Python e Web Development. Seu foco principal é a criação de Scanners e ferramentas avançadas de análise forense de sistema.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className={`accordion-item ${activeAccordion === 1 ? 'active' : ''}`}>
          <button className="accordion-header" onClick={() => toggleAccordion(1)}>
            <h2>Onde ele atua?</h2>
            <svg className="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div className="accordion-content">
            <div className="accordion-inner">
              <div className="accordion-inner-content">
                <p>Atualmente, Samuca lidera o desenvolvimento e a pesquisa de segurança na <strong>Team Lodark</strong>, codando scanners proprietários, ferramentas de análise e estruturando soluções inovadoras para a comunidade.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className={`accordion-item ${activeAccordion === 2 ? 'active' : ''}`}>
          <button className="accordion-header" onClick={() => toggleAccordion(2)}>
            <h2>A Trajetória</h2>
            <svg className="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div className="accordion-content">
            <div className="accordion-inner">
              <div className="accordion-inner-content">
                <p>Tudo começou no cenário de FiveM, onde Samuca deu seus primeiros passos aprendendo a analisar sistemas de forma avançada com o Lodark e o mano Gringo — duas das maiores referências do Brasil que ensinaram ele a telar. Com o tempo, a parceria entre Lodark e Samuca se estreitou, levando a expertise deles para o cenário de Free Fire, sempre em uma busca implacável por novos métodos e brechas de segurança.</p>
                <p>Após um período focado exclusivamente na área de Bypass — onde adquiriu uma bagagem absurda sobre o funcionamento interno das trapaças —, Samuca retornou com foco total para a engenharia de Screen Share. Esse conhecimento foi a base para o desenvolvimento do Lodark AC.</p>
                <p>Hoje, o trio original está de volta: Gringo, Lodark e Samuca unem forças novamente na <strong>Team Lodark</strong>, com o objetivo claro de consolidar a equipe como a maior e mais eficiente em SS do mercado.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="cta-section slide-up delay-2">
        <h2 className="cta-title">Vamos conversar?</h2>
        <p className="cta-subtitle">Quer entender o meu fluxo de trabalho ou conhecer as soluções da nossa equipe?</p>
        
        <a href="https://discord.gg/RnANWbrPyQ" target="_blank" rel="noopener noreferrer" className="discord-btn">
          <span>Entrar no Discord</span>
        </a>
      </footer>
    </main>
  )
}
