'use client';

import { useState } from 'react';

const PLANS = [
  {
    name: 'Basic',
    desc: 'A porta de entrada ideal com recursos essenciais.',
    features: ['Funcionalidades Padrão', 'Suporte Básico', 'Updates Semanais'],
    recommended: false,
  },
  {
    name: 'Remote',
    desc: 'Acesso remoto otimizado para setups flexíveis.',
    features: ['Controle Remoto Web', 'Baixa Latência', 'Painel Dedicado'],
    recommended: false,
  },
  {
    name: 'External',
    desc: 'Operação fora do motor principal. Máxima segurança.',
    features: ['Overlay Invisível', 'Sem injeção de memória', 'Seguro contra varreduras'],
    recommended: false,
  },
  {
    name: 'Private',
    desc: 'Slots controlados para máxima discrição.',
    features: ['Build Única (Polimorfismo)', 'Streamproof Garantido', 'HWID Spoofer Incluso'],
    recommended: true,
  },
  {
    name: 'Internal',
    desc: 'Acesso profundo com performance impecável.',
    features: ['Injeção Ring 0', 'Alta Performance (0 delay)', 'Proteção Kernel'],
    recommended: false,
  },
];

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthOpenTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || (authTab === 'register' && !licenseKey)) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const hwid = btoa(navigator.userAgent).substring(0, 16).toUpperCase();
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: authTab,
          username,
          password,
          licenseKey,
          hwid,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('kaze_token', data.token);
        localStorage.setItem('kaze_user', JSON.stringify(data.user));
        alert(data.message);
        window.location.href = '/dashboard';
      } else {
        alert(data.message || 'Ocorreu um erro.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-[#f5f5f7] relative">
      {/* Background Dots & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(at_50%_0%,rgba(168,85,247,0.02)_0,transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.004)_1px,transparent_0)] bg-[size:20px_20px] pointer-events-none" />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-[#111111] bg-black/70 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="flex items-center gap-2 font-mono text-xs tracking-[3px] uppercase font-semibold text-[#f5f5f7]">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          Kaze Auth
        </div>
        <div className="flex items-center gap-8">
          <a href="#plans" className="font-mono text-[10px] tracking-wider uppercase text-muted hover:text-white transition">Planos</a>
          <button onClick={() => { setAuthOpenTab('login'); setAuthOpen(true); }} className="font-mono text-[10px] tracking-wider uppercase text-muted hover:text-white transition">Entrar</button>
          <button onClick={() => { setAuthOpenTab('register'); setAuthOpen(true); }} className="font-mono text-[10px] tracking-[1.5px] uppercase border border-[#111111] hover:border-[#333] px-4 py-2 rounded transition bg-transparent text-white">Criar Conta</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center pt-40 px-6 pb-20">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 bg-gradient-to-b from-white to-[#a3a3a3] bg-clip-text text-transparent">
          Autenticação de Alta Performance
        </h1>
        <p className="text-[#666666] text-sm max-w-[500px] mb-8 leading-relaxed font-light">
          A infraestrutura definitiva para gerenciar licenças, usuários e integrações. Criptografia ponta a ponta e máxima segurança para o seu software interno.
        </p>
        <button onClick={() => { setAuthOpenTab('register'); setAuthOpen(true); }} className="font-mono text-[10px] tracking-[2px] uppercase border border-[#111111] hover:border-[#333] hover:bg-white/5 px-8 py-4 rounded transition bg-transparent text-[#f5f5f7]">
          Começar Agora
        </button>
      </section>

      {/* Plans Section */}
      <section id="plans" className="max-w-[1200px] mx-auto px-8 py-20">
        <h2 className="text-center font-mono text-[10px] text-[#666666] tracking-[4px] uppercase mb-12">Nossas Soluções</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`bg-[#030303] border rounded-lg p-8 flex flex-col transition duration-200 ${
                plan.recommended 
                  ? 'border-purple-950 hover:border-purple-600' 
                  : 'border-[#141414] hover:border-[#262626] hover:bg-[#050505]'
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-4 right-4 text-[8px] font-mono tracking-widest text-accent font-semibold">RECOMENDADO</div>
              )}
              <h3 className="text-sm font-medium tracking-wider font-mono uppercase text-white mb-2">{plan.name}</h3>
              <p className="text-[11px] text-[#666] mb-6 min-h-[50px] leading-relaxed">{plan.desc}</p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-[#666] text-[10px] flex items-center gap-2">
                    <span className="text-[12px] text-[#444]">•</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => { setAuthOpenTab('register'); setAuthOpen(true); }}
                className={`w-full py-3 rounded-md text-[10px] font-mono tracking-wider transition ${
                  plan.recommended 
                    ? 'border border-purple-900/40 text-accent hover:bg-purple-950/25 hover:border-purple-500' 
                    : 'border border-[#1c1c1c] text-[#888] hover:text-white hover:border-[#f5f5f7]'
                }`}
              >
                {plan.name === 'Internal' ? 'Comprar Internal' : `Assinar ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Auth Modal */}
      {authOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 transition-all p-4">
          <div className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-purple-900/20 w-full max-w-[440px] px-8 py-10 rounded-xl relative shadow-2xl">
            {/* Close Button */}
            <button onClick={() => setAuthOpen(false)} className="absolute top-6 right-6 text-[#666] hover:text-white transition font-light text-xl">×</button>
            
            <h2 className="text-[11px] font-mono tracking-[3px] text-[#666] uppercase mb-8 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Acesso Restrito
            </h2>

            {/* Tabs */}
            <div className="grid grid-cols-2 bg-black/50 border border-[#111] p-1 rounded-lg mb-8">
              <button onClick={() => setAuthOpenTab('login')} className={`py-2 text-[10px] font-mono tracking-wider uppercase rounded-md transition ${authTab === 'login' ? 'bg-purple-950/20 text-accent border border-purple-900/30' : 'text-[#666] hover:text-white'}`}>Login</button>
              <button onClick={() => setAuthOpenTab('register')} className={`py-2 text-[10px] font-mono tracking-wider uppercase rounded-md transition ${authTab === 'register' ? 'bg-purple-950/20 text-accent border border-purple-900/30' : 'text-[#666] hover:text-white'}`}>Registro</button>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-5">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-[#111] focus:border-accent rounded-md px-4 py-3.5 text-xs text-white outline-none font-mono transition"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-[#111] focus:border-accent rounded-md px-4 py-3.5 text-xs text-white outline-none font-mono transition"
                  required
                />
              </div>
              {authTab === 'register' && (
                <div>
                  <input
                    type="text"
                    placeholder="License Key (Ex: KAZE-XXXX)"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    className="w-full bg-black/40 border border-[#111] focus:border-accent rounded-md px-4 py-3.5 text-xs text-white outline-none font-mono transition"
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-accent to-[#7c3aed] text-white py-3.5 rounded-md text-[10px] font-mono tracking-widest uppercase hover:brightness-110 active:scale-[0.99] transition duration-200 font-semibold mt-4 shadow-lg shadow-purple-950/20"
              >
                {loading ? 'Processando...' : authTab === 'login' ? 'Entrar no Painel' : 'Criar Conta'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
