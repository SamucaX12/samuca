'use client'

import { useState } from 'react'
import { ShieldAlert, Search, Activity, Cpu, AlertTriangle, CheckCircle, Info, LockKeyhole } from 'lucide-react'

export default function DashboardPage() {
  const [pin, setPin] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchBam, setSearchBam] = useState('')
  const [loading, setLoading] = useState(false)

  const [dbData, setDbData] = useState(null)
  const [error, setError] = useState('')

  const handlePinSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setDbData(data.data)
        setIsAuthenticated(true)
      } else {
        setError(data.error || 'PIN Inválido')
      }
    } catch (err) {
      setError('Erro de conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container animate-fade-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '600px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Team Lodark <span style={{ color: 'var(--brand-purple)' }}>Scanner</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Desenvolvido por Samuca para análises avançadas e segurança defensiva da Team Lodark.</p>
        </div>

        <div className="glass-panel delay-100 animate-fade-in" style={{ width: '100%', maxWidth: '360px', padding: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--brand-purple)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <LockKeyhole size={48} strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Informe o PIN do Scan</h2>
          <form onSubmit={handlePinSubmit}>
            <input 
              type="password" 
              className={`input-field font-mono ${error ? 'input-error' : ''}`}
              style={{ textAlign: 'center', letterSpacing: '0.25em', fontSize: '1.25rem', marginBottom: '1rem' }}
              placeholder="••••" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              required
            />
            {error && <div style={{ color: 'var(--status-critical)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading || pin.length < 4}>
              {loading ? 'Verificando...' : 'Descriptografar Resultados'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 2rem' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Relatório de Scan</h1>
          <p style={{ color: 'var(--text-muted)' }}>Resultados analisados pelo motor do Samuca.</p>
        </div>
        <div className="badge badge-normal" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <CheckCircle size={16} style={{ marginRight: '0.5rem' }} />
          Scan Finalizado
        </div>
      </header>

      <div style={{ display: 'grid', gap: '2rem' }}>
        
        {/* BAM Section */}
        <section className="glass-panel p-6 delay-100 animate-fade-in" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
              <Activity size={20} color="var(--brand-purple)" />
              BAM (Sem Assinatura)
            </h2>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field" 
                style={{ paddingLeft: '2.5rem', padding: '0.5rem 1rem 0.5rem 2.5rem', fontSize: '0.9rem' }}
                placeholder="Pesquisar registro..." 
                value={searchBam}
                onChange={(e) => setSearchBam(e.target.value)}
              />
            </div>
          </div>
          
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Caminho / Executável</th>
                  <th style={{ padding: '1rem' }}>Última Execução</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {dbData?.bam?.filter(item => item.path.toLowerCase().includes(searchBam.toLowerCase())).map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '1rem' }}>{item.path}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{item.lastRun}</td>
                    <td style={{ padding: '1rem' }}><span className={`badge badge-${item.status}`}>{item.statusLabel}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bypass Genérico & Serviços */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <section className="glass-panel delay-200 animate-fade-in" style={{ padding: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              <ShieldAlert size={20} color="var(--brand-purple)" />
              Bypass Genérico
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {dbData?.bypasses?.map((bp, idx) => (
                <div key={idx} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '500' }}>{bp.title}</span>
                    <span className={`badge badge-${bp.status}`}>{bp.statusLabel}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{bp.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel delay-300 animate-fade-in" style={{ padding: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              <Cpu size={20} color="var(--brand-purple)" />
              Serviços (Services)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {dbData?.services?.map((svc, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {svc.status === 'critical' && <ShieldAlert size={18} color="var(--status-critical)" />}
                    {svc.status === 'warning' && <AlertTriangle size={18} color="var(--status-warning)" />}
                    {svc.status === 'suspect' && <Info size={18} color="var(--status-suspect)" />}
                    {svc.status === 'normal' && <CheckCircle size={18} color="var(--status-normal)" />}
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{svc.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{svc.path}</div>
                    </div>
                  </div>
                  <span className={`badge badge-${svc.status}`}>{svc.statusLabel}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
