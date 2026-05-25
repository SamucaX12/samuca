import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

async function verifyUser(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (e) {
    return null;
  }
}

export async function GET(req: Request) {
  const user = await verifyUser(req);
  if (!user) {
    return NextResponse.json({ message: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const db = await getDb();
    const licenses = await db.collection('licenses').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, licenses });
  } catch (e: any) {
    return NextResponse.json({ message: 'Erro ao buscar licenças', error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await verifyUser(req);
  if (!user) {
    return NextResponse.json({ message: 'Acesso não autorizado' }, { status: 401 });
  }

  const { action, plan, duration, key } = await req.json();
  const db = await getDb();

  // Resetar HWID
  if (action === 'reset_hwid') {
    if (!key) {
      return NextResponse.json({ message: 'Especifique a licença para resetar' }, { status: 400 });
    }

    try {
      const license = await db.collection('licenses').findOne({ key });
      if (!license) {
        return NextResponse.json({ message: 'Licença não encontrada' }, { status: 404 });
      }

      await db.collection('licenses').updateOne(
        { key },
        { $set: { hwid: 'NOT_SET' } }
      );

      await db.collection('users').updateOne(
        { licenseKey: key },
        { $set: { hwid: 'NOT_SET' } }
      );

      return NextResponse.json({ success: true, message: 'HWID resetado com sucesso!' });
    } catch (e: any) {
      return NextResponse.json({ message: 'Erro ao resetar HWID', error: e.message }, { status: 500 });
    }
  }

  // Gerar chave (Apenas CEO)
  if (action === 'generate') {
    if (user.role !== 'CEO') {
      return NextResponse.json({ message: 'Permissão negada. Apenas CEO pode gerar chaves.' }, { status: 403 });
    }

    if (!plan || !duration) {
      return NextResponse.json({ message: 'Falta especificar o plano e duração' }, { status: 400 });
    }

    try {
      const rand = (len: number) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let res = '';
        for (let i = 0; i < len; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
        return res;
      };

      const keyGenerated = `KAZE-${plan.toUpperCase()}-${rand(4)}-${rand(4)}`;

      const newLicense = {
        key: keyGenerated,
        plan,
        duration,
        status: 'Aguardando',
        createdAt: new Date(),
        createdBy: user.username,
        hwid: 'NOT_SET'
      };

      await db.collection('licenses').insertOne(newLicense);
      return NextResponse.json({ success: true, key: keyGenerated, license: newLicense }, { status: 201 });
    } catch (e: any) {
      return NextResponse.json({ message: 'Erro ao gerar licença', error: e.message }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Ação inválida' }, { status: 400 });
}

export async function DELETE(req: Request) {
  const user = await verifyUser(req);
  if (!user || user.role !== 'CEO') {
    return NextResponse.json({ message: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const { key } = await req.json();
    if (!key) {
      return NextResponse.json({ message: 'Falta especificar a chave' }, { status: 400 });
    }

    const db = await getDb();
    await db.collection('licenses').deleteOne({ key });
    await db.collection('users').deleteOne({ licenseKey: key });

    return NextResponse.json({ success: true, message: 'Licença revogada com sucesso!' });
  } catch (e: any) {
    return NextResponse.json({ message: 'Erro ao revogar licença', error: e.message }, { status: 500 });
  }
}
