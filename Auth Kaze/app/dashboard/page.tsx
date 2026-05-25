'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, ShieldAlert, KeyRound, Shield, RefreshCw } from 'lucide-react';

interface License {
  key: string;
  plan: string;
  duration: string;
  status: string;
  createdAt: string;
  createdBy: string;
  hwid: string;
}

interface TeamMember {
  username: string;
  role: string;
  createdAt: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'ceo' | 'team'>('overview');
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // States para dados
  const [licenses, setLicenses] = useState<License[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  
  // States para formulários
  const [searchKey, setSearchKey] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('Basic');
  const [selectedDuration, setSelectedDuration] = useState('1 Dia');
  const [generatedKey, setGeneratedKey] = useState('');
  const [staffUsername, setStaffUsername] = useState('');
  const [staffRole, setStaffRole] = useState('Staff');

  useEffect(() => {
    const savedToken = localStorage.getItem('kaze_token');
    const savedUser = localStorage.getItem('kaze_user');

    if (!savedToken || !savedUser) {
      window.location.href = '/';
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== 'CEO' && parsedUser.role !== 'Staff') {
      localStorage.clear();
      window.location.href = '/';
      return;
    }

    setToken(savedToken);
    setCurrentUser(parsedUser);
  }, []);

  // Buscar licenças ao obter o token
  useEffect(() => {
    if (token) {
      fetchLicenses();
      if (currentUser?.role === 'CEO') {
        fetchTeam();
      }
    }
  }, [token, currentUser]);

  const fetchLicenses = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/keys', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setLicenses(data.licenses || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTeam = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/team', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTeam(data.team || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generateKey = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'generate', plan: selectedPlan, duration: selectedDuration }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedKey(data.key);
        fetchLicenses();
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const revokeKey = async (key: string) => {
    if (!token) return;
    if (!confirm(`Deseja revogar a licença ${key}?`)) return;

    try {
      const res = await fetch('/api/keys', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) {
        fetchLicenses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetHWID = async () => {
    if (!token || !searchKey) return;
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'reset_hwid', key: searchKey }),
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) {
        setSearchKey('');
        fetchLicenses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addStaff = async () => {
    if (!token) return;
    const password = prompt(`Defina uma senha para o novo membro ${staffUsername}:`);
    if (!password) return;

    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username: staffUsername, password, role: staffRole }),
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) {
        setStaffUsername('');
        fetchTeam();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeStaff = async (username: string) => {
    if (!token) return;
    if (!confirm(`Deseja revogar o acesso de ${username}?`)) return;

    try {
      const res = await fetch('/api/team', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) {
        fetchTeam();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex relative">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#111111] bg-black h-screen fixed flex flex-col py-8 z-20">
        <div className="px-6 mb-8 flex items-center gap-2 font-mono text-[10px] tracking-[4px] uppercase font-semibold text-[#f5f5f7]">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Kaze Admin
        </div>

        <div className="px-6 text-[8px] font-mono text-muted tracking-widest uppercase mb-3">Principal</div>
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-3 px-6 py-3 text-xs ${activeTab === 'overview' ? 'text-white bg-white/[0.02] font-semibold border-l-2 border-accent' : 'text-muted hover:text-white'}`}
        >
          <LayoutGrid size={14} />
          Overview
        </button>

        <div className="px-6 text-[8px] font-mono text-muted tracking-widest uppercase mt-6 mb-3">Área Staff</div>
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-3 px-6 py-3 text-xs ${activeTab === 'staff' ? 'text-white bg-white/[0.02] font-semibold border-l-2 border-accent' : 'text-muted hover:text-white'}`}
        >
          <ShieldAlert size={14} />
          Controle de HWID
        </button>

        {currentUser.role === 'CEO' && (
          <>
            <div className="px-6 text-[8px] font-mono text-muted tracking-widest uppercase mt-6 mb-3">Área CEO</div>
            <button
              onClick={() => setActiveTab('ceo')}
              className={`flex items-center gap-3 px-6 py-3 text-xs ${activeTab === 'ceo' ? 'text-white bg-white/[0.02] font-semibold border-l-2 border-accent' : 'text-muted hover:text-white'}`}
            >
              <KeyRound size={14} />
              Gerador Master
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-3 px-6 py-3 text-xs ${activeTab === 'team' ? 'text-white bg-white/[0.02] font-semibold border-l-2 border-accent' : 'text-muted hover:text-white'}`}
            >
              <Shield size={14} />
              Gestão de Equipe
            </button>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-12 min-h-screen">
        <header className="flex justify-between items-end border-b border-[#111] pb-6 mb-10">
          <div>
            <h1 className="text-xl font-medium tracking-wide text-white capitalize">{activeTab}</h1>
            <p className="text-[11px] text-muted font-light mt-1">Gerencie a infraestrutura e credenciais do ecossistema.</p>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-[10px] font-mono px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            MongoDB Connected
          </div>
        </header>

        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#050505] border border-[#111] rounded-lg p-6">
                <div className="text-[10px] font-mono text-muted tracking-wider uppercase mb-3">Chaves Geradas</div>
                <div className="text-2xl font-semibold tracking-tight text-white">{licenses.length}</div>
                <div className="text-[9px] text-[#555] mt-1.5">Sincronizado no banco</div>
              </div>
              <div className="bg-[#050505] border border-[#111] rounded-lg p-6">
                <div className="text-[10px] font-mono text-muted tracking-wider uppercase mb-3">Licenças Ativas</div>
                <div className="text-2xl font-semibold tracking-tight text-white">{licenses.filter(l => l.status === 'Ativa').length}</div>
                <div className="text-[9px] text-emerald-500 mt-1.5">HWID Bloqueado</div>
              </div>
              <div className="bg-[#050505] border border-[#111] rounded-lg p-6">
                <div className="text-[10px] font-mono text-muted tracking-wider uppercase mb-3">Região Host</div>
                <div className="text-2xl font-semibold tracking-tight text-white">gru1</div>
                <div className="text-[9px] text-purple-400 mt-1.5">AWS São Paulo</div>
              </div>
              <div className="bg-[#050505] border border-[#111] rounded-lg p-6">
                <div className="text-[10px] font-mono text-muted tracking-wider uppercase mb-3">Segurança API</div>
                <div className="text-2xl font-semibold tracking-tight text-emerald-400 font-mono text-lg py-1">Secure SSL</div>
                <div className="text-[9px] text-[#555] mt-1">AES-256-GCM</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#050505] border border-[#111] rounded-lg p-8">
                <h3 className="text-xs font-mono text-white tracking-widest uppercase border-l-2 border-accent pl-3 mb-6">Especificações Técnicas</h3>
                <ul className="space-y-4 text-xs font-mono">
                  <li className="flex justify-between border-b border-[#111] pb-2"><span className="text-[#555]">Framework</span><span>Next.js (App Router)</span></li>
                  <li className="flex justify-between border-b border-[#111] pb-2"><span className="text-[#555]">Serverless Deployment</span><span>Vercel Edge Network</span></li>
                  <li className="flex justify-between border-b border-[#111] pb-2"><span className="text-[#555]">Database</span><span>MongoDB Atlas Cloud</span></li>
                  <li className="flex justify-between"><span className="text-[#555]">Session Tokenizer</span><span>JWT Symmetric HS256</span></li>
                </ul>
              </div>
              <div className="bg-[#050505] border border-[#111] rounded-lg p-8">
                <h3 className="text-xs font-mono text-white tracking-widest uppercase border-l-2 border-accent pl-3 mb-6">MongoDB Event Logs</h3>
                <div className="font-mono text-[10px] leading-relaxed text-[#555] space-y-2">
                  <div>[<span className="text-emerald-500">OK</span>] Conexão ativa com kaze-auth-db Atlas.</div>
                  <div>[<span className="text-accent">INFO</span>] API Serverless carregada na Vercel com sucesso.</div>
                  {licenses.slice(0, 2).map((l, i) => (
                    <div key={i}>[<span className="text-accent">INFO</span>] Licença {l.key.substring(0, 15)}... carregada do banco.</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. STAFF - CONTROLE DE HWID */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="bg-[#050505] border border-[#111] rounded-lg p-8">
              <h3 className="text-xs font-mono text-white tracking-widest uppercase border-l-2 border-accent pl-3 mb-6">Resetar trava de hardware (HWID)</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Insira a Licença (KAZE-XXXX-...)"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  className="flex-1 bg-black border border-[#141414] focus:border-accent rounded-md px-4 py-3 text-xs outline-none font-mono text-white"
                />
                <button onClick={resetHWID} className="bg-white text-black text-[10px] font-mono tracking-widest uppercase px-6 rounded-md hover:bg-white/90 active:scale-[0.99] transition">Resetar HWID</button>
              </div>
              <p className="text-[10px] text-muted font-mono mt-3">// O Reset limpa o HWID no MongoDB permitindo que o cliente reative em outra máquina.</p>
            </div>

            <div className="bg-[#050505] border border-[#111] rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/35 font-mono text-[9px] text-muted tracking-widest uppercase">
                    <th className="p-4 px-6">Licença</th>
                    <th className="p-4">Plano</th>
                    <th className="p-4">Último HWID</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {licenses.map((l) => (
                    <tr key={l.key} className="border-t border-[#111] hover:bg-white/[0.01] transition">
                      <td className="p-4 px-6 font-mono text-[#f5f5f7]">{l.key}</td>
                      <td className="p-4"><span className="border border-[#1c1c1c] text-muted rounded px-2.5 py-1 text-[9px] font-mono uppercase">{l.plan}</span></td>
                      <td className="p-4 font-mono text-[#888]">{l.hwid}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-medium ${l.status === 'Ativa' ? 'text-emerald-400' : 'text-amber-500'}`}>
                          ● {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. CEO - GERADOR MASTER */}
        {activeTab === 'ceo' && currentUser.role === 'CEO' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#050505] border border-[#111] rounded-lg p-8">
              <h3 className="text-xs font-mono text-white tracking-widest uppercase border-l-2 border-accent pl-3 mb-6">Criar Nova Credencial</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[9px] font-mono text-muted tracking-wider uppercase mb-2">Plano</label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full bg-black border border-[#141414] focus:border-accent rounded-md px-4 py-3 text-xs outline-none text-white font-mono"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Remote">Remote</option>
                    <option value="External">External</option>
                    <option value="Private">Private</option>
                    <option value="Internal">Internal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-muted tracking-wider uppercase mb-2">Duração</label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full bg-black border border-[#141414] focus:border-accent rounded-md px-4 py-3 text-xs outline-none text-white font-mono"
                  >
                    <option value="1 Dia">1 Dia</option>
                    <option value="7 Dias">7 Dias</option>
                    <option value="30 Dias">30 Dias</option>
                    <option value="Lifetime">Lifetime</option>
                  </select>
                </div>

                <button onClick={generateKey} className="w-full bg-white text-black py-3.5 rounded-md text-[10px] font-mono tracking-widest uppercase hover:bg-white/90 active:scale-[0.99] transition font-semibold mt-4">
                  Gerar Licença Master
                </button>

                {generatedKey && (
                  <div className="mt-6 p-4 bg-purple-950/10 border border-purple-900/20 rounded-md flex justify-between items-center animate-pulse">
                    <div>
                      <div className="text-[8px] font-mono text-accent tracking-widest uppercase mb-1">Licença Criada</div>
                      <div className="text-xs font-mono text-white">{generatedKey}</div>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(generatedKey); alert('Copiado!'); }}
                      className="border border-accent/30 text-accent text-[9px] font-mono px-3 py-1.5 rounded hover:bg-purple-900/10 transition"
                    >
                      Copiar
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#050505] border border-[#111] rounded-lg p-8">
              <h3 className="text-xs font-mono text-white tracking-widest uppercase border-l-2 border-accent pl-3 mb-6">Chaves Ativas no Banco</h3>
              <div className="overflow-hidden border border-[#111] rounded-md bg-black/20">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/35 font-mono text-[9px] text-muted tracking-widest uppercase">
                      <th className="p-3 px-5">Chave</th>
                      <th className="p-3">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-mono">
                    {licenses.map((l) => (
                      <tr key={l.key} className="border-t border-[#111] hover:bg-white/[0.01]">
                        <td className="p-3 px-5 text-white">{l.key.substring(0, 18)}...</td>
                        <td className="p-3">
                          <button onClick={() => revokeKey(l.key)} className="text-red-500 hover:text-red-400 text-[10px]">Deletar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. TEAM - GESTÃO DE EQUIPE */}
        {activeTab === 'team' && currentUser.role === 'CEO' && (
          <div className="space-y-6">
            <div className="bg-[#050505] border border-[#111] rounded-lg p-8">
              <h3 className="text-xs font-mono text-white tracking-widest uppercase border-l-2 border-accent pl-3 mb-6">Adicionar Membro da Staff</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Username do Staff"
                  value={staffUsername}
                  onChange={(e) => setStaffUsername(e.target.value)}
                  className="bg-black border border-[#141414] focus:border-accent rounded-md px-4 py-3 text-xs outline-none font-mono text-white"
                />
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  className="bg-black border border-[#141414] focus:border-accent rounded-md px-4 py-3 text-xs outline-none text-white font-mono"
                >
                  <option value="Staff">Staff (Consulta e Reset HWID)</option>
                  <option value="CEO">CEO (Acesso Total)</option>
                </select>
              </div>
              <button onClick={addStaff} className="bg-white text-black text-[10px] font-mono tracking-widest uppercase px-6 py-3 rounded-md hover:bg-white/90 transition font-semibold">Adicionar à Equipe</button>
            </div>

            <div className="bg-[#050505] border border-[#111] rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/35 font-mono text-[9px] text-muted tracking-widest uppercase">
                    <th className="p-4 px-6">Membro</th>
                    <th className="p-4">Cargo</th>
                    <th className="p-4">Última Ação</th>
                    <th className="p-4">Ação</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {team.map((member) => (
                    <tr key={member.username} className="border-t border-[#111] hover:bg-white/[0.01] transition">
                      <td className="p-4 px-6 font-mono text-[#f5f5f7]">{member.username}</td>
                      <td className="p-4">
                        <span className={`border rounded px-2.5 py-1 text-[9px] font-mono uppercase ${member.role === 'CEO' ? 'border-purple-900/40 text-accent' : 'border-[#1c1c1c] text-muted'}`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="p-4 text-muted">Cadastrado em {new Date(member.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="p-4">
                        {member.username.toLowerCase() === currentUser.username.toLowerCase() ? (
                          <span className="text-[10px] text-[#555] font-mono">Você</span>
                        ) : (
                          <button onClick={() => removeStaff(member.username)} className="text-red-500 hover:text-red-400 text-xs">Revogar</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
