import './globals.css'

export const metadata = {
  title: 'Lodark Scanner | Dashboard',
  description: 'Scanner avançado desenvolvido por Samuca para a Team Lodark.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Background glow effects */}
        <div style={{ position: 'fixed', top: '-10%', left: '20%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none', zIndex: -1 }}></div>
        <div style={{ position: 'fixed', bottom: '-10%', right: '10%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none', zIndex: -1 }}></div>
        
        {children}
      </body>
    </html>
  )
}
