import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

async function verifyCEO(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role === 'CEO') return decoded;
    return null;
  } catch (e) {
    return null;
  }
}

export async function GET(req: Request) {
  const ceo = await verifyCEO(req);
  if (!ceo) {
    return NextResponse.json({ message: 'Acesso negado. Apenas CEO.' }, { status: 403 });
  }

  try {
    const db = await getDb();
    const team = await db.collection('users')
      .find({ role: { $in: ['Staff', 'CEO'] } })
      .project({ password: 0 })
      .toArray();
    return NextResponse.json({ success: true, team });
  } catch (e: any) {
    return NextResponse.json({ message: 'Erro ao buscar equipe', error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const ceo = await verifyCEO(req);
  if (!ceo) {
    return NextResponse.json({ message: 'Acesso negado. Apenas CEO.' }, { status: 403 });
  }

  try {
    const { username, password, role } = await req.json();
    if (!username || !password || !role) {
      return NextResponse.json({ message: 'Preencha usuário, senha e cargo' }, { status: 400 });
    }

    const db = await getDb();
    const existingUser = await db.collection('users').findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ message: 'Nome de usuário já cadastrado' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStaff = {
      username: username.toLowerCase(),
      password: hashedPassword,
      role: role === 'CEO' ? 'CEO' : 'Staff',
      createdAt: new Date(),
      licenseKey: 'STAFF_MEMBER',
      hwid: 'NOT_SET'
    };

    await db.collection('users').insertOne(newStaff);
    return NextResponse.json({ success: true, message: `Membro ${username} adicionado como ${role}!` }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: 'Erro ao adicionar staff', error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const ceo = await verifyCEO(req);
  if (!ceo) {
    return NextResponse.json({ message: 'Acesso negado. Apenas CEO.' }, { status: 403 });
  }

  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ message: 'Falta especificar o usuário' }, { status: 400 });
    }

    if (username.toLowerCase() === ceo.username.toLowerCase()) {
      return NextResponse.json({ message: 'Você não pode revogar seu próprio acesso de CEO.' }, { status: 400 });
    }

    const db = await getDb();
    await db.collection('users').deleteOne({ username: username.toLowerCase() });
    return NextResponse.json({ success: true, message: 'Acesso revogado com sucesso!' });
  } catch (e: any) {
    return NextResponse.json({ message: 'Erro ao remover membro', error: e.message }, { status: 500 });
  }
}
