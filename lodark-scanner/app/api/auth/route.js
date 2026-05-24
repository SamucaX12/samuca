import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const client = await clientPromise;
    const db = client.db('lodark_scanner');

    // Inicializar o banco se estiver vazio para que você possa testar direto
    const usersCount = await db.collection('users').countDocuments();
    if (usersCount === 0) {
      await db.collection('users').insertOne({
        username: 'Samuca',
        password: 'samuca12',
        pin: '1234'
      });
    }

    const user = await db.collection('users').findOne({ username });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado no MongoDB' }, { status: 401 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: 'Autenticado com sucesso via MongoDB' });

  } catch (e) {
    console.error('MongoDB Error:', e);
    return NextResponse.json({ error: 'Falha na conexão com o MongoDB' }, { status: 500 });
  }
}
