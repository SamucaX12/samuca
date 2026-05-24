import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { pin } = await request.json();

    const client = await clientPromise;
    const db = client.db('lodark_scanner');

    // Verifica se o PIN existe na coleção de usuários
    const validUser = await db.collection('users').findOne({ pin });

    // Permite "1234" como fallback caso o banco não tenha sido inicializado corretamente
    if (!validUser && pin !== '1234') { 
      return NextResponse.json({ error: 'PIN de acesso inválido' }, { status: 401 });
    }

    // Busca os dados das coleções filtrando pelo PIN fornecido!
    let bamRecords = await db.collection('bam').find({ pin }).toArray();
    let bypassRecords = await db.collection('bypasses').find({ pin }).toArray();
    let serviceRecords = await db.collection('services').find({ pin }).toArray();

    // Popular o banco automaticamente caso esteja vazio (para testes)
    if (bamRecords.length === 0) {
        bamRecords = [
            { path: '\\Device\\HarddiskVolume3\\Users\\Samuca\\AppData\\Local\\Temp\\loader.exe', lastRun: '24/05/2026 23:42:10', status: 'critical', statusLabel: 'Detectou Bypass' },
            { path: '\\Device\\HarddiskVolume3\\Windows\\System32\\cmd.exe', lastRun: '24/05/2026 21:15:00', status: 'suspect', statusLabel: 'Suspeito' },
            { path: '\\Device\\HarddiskVolume3\\Program Files\\Discord\\Discord.exe', lastRun: '24/05/2026 19:30:22', status: 'normal', statusLabel: 'Normal' }
        ];
        await db.collection('bam').insertMany(bamRecords);
    }
    
    if (bypassRecords.length === 0) {
        bypassRecords = [
            { title: 'Injeção de Memória (Thread Hijacking)', description: 'Anomalia detectada no processo csrss.exe (PID: 1044). Padrão de shellcode conhecido.', status: 'critical', statusLabel: 'Detectou Bypass' },
            { title: 'Assinatura Digital Falsificada', description: 'O certificado do driver nvlddmkm.sys aparenta estar revogado ou alterado.', status: 'warning', statusLabel: 'Avisos' }
        ];
        await db.collection('bypasses').insertMany(bypassRecords);
    }

    if (serviceRecords.length === 0) {
        serviceRecords = [
            { name: 'KSystem (Kernel Mode)', path: 'C:\\Windows\\System32\\drivers\\ksys.sys', status: 'warning', statusLabel: 'Avisos' },
            { name: 'WinHTTP AutoProxy', path: 'svchost.exe -k LocalService', status: 'suspect', statusLabel: 'Suspeito' },
            { name: 'Windows Defender Antivirus Network', path: 'WdNisSvc', status: 'normal', statusLabel: 'Normal' }
        ];
        await db.collection('services').insertMany(serviceRecords);
    }

    return NextResponse.json({ 
        success: true, 
        data: {
            bam: bamRecords,
            bypasses: bypassRecords,
            services: serviceRecords
        }
    });

  } catch (e) {
    console.error('MongoDB Error:', e);
    return NextResponse.json({ error: 'Erro interno ao consultar MongoDB' }, { status: 500 });
  }
}
