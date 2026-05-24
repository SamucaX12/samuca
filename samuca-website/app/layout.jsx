import './globals.css'
import Cursor from '@/components/Cursor'
import ParticlesBackground from '@/components/ParticlesBackground'

export const metadata = {
  title: 'Samuca | Desenvolvedor & Especialista em Screen Share',
  description: 'Samuca é um desenvolvedor especialista em Anti-Cheat e Screen Share. Conheça sua trajetória e projetos na Team Lodark.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Cursor />
        <ParticlesBackground />
        <div className="bg-glow"></div>
        <div className="bg-glow bg-glow-2"></div>
        {children}
      </body>
    </html>
  )
}
