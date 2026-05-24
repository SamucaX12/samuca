'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Lock, User } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      const data = await response.json()

      if (response.ok && data.success) {
        router.push('/dashboard')
      } else {
        setError(data.error || 'Credenciais inválidas.')
        setLoading(false)
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.')
      setLoading(false)
    }
  }

  return (
    <div className="container animate-fade-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid var(--border-color)', marginBottom: '1rem', color: 'var(--brand-purple)' }}>
            <Shield size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Lodark Scanner</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Acesso restrito à equipe técnica.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Usuário</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <User size={18} />
              </div>
              <input 
                type="text" 
                className={`input-field ${error ? 'input-error' : ''}`}
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Insira seu usuário" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                className={`input-field ${error ? 'input-error' : ''}`}
                style={{ paddingLeft: '2.75rem' }}
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div style={{ color: 'var(--status-critical)', fontSize: '0.85rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Autenticando...' : 'Acessar Scanner'}
          </button>
        </form>
      </div>
    </div>
  )
}
