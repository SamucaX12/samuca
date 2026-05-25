import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

export async function POST(req: Request) {
  try {
    const { action, username, password, licenseKey, hwid } = await req.json();
    const db = await getDb();

    // REGISTRO
    if (action === 'register') {
      if (!username || !password || !licenseKey) {
        return NextResponse.json({ message: 'Preencha todos os campos obrigatórios' }, { status: 400 });
      }

      // 1. Validar chave de licença
      const license = await db.collection('licenses').findOne({ key: licenseKey });
      if (!license) {
        return NextResponse.json({ message: 'Chave de licença inválida' }, { status: 400 });
      }

      if (license.status === 'Ativa') {
        return NextResponse.json({ message: 'Esta licença já está em uso' }, { status: 400 });
      }

      // 2. Verificar se usuário existe
      const existingUser = await db.collection('users').findOne({ username: username.toLowerCase() });
      if (existingUser) {
        return NextResponse.json({ message: 'Nome de usuário já cadastrado' }, { status: 400 });
      }

      // 3. Criar hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4. Salvar usuário
      const newUser = {
        username: username.toLowerCase(),
        password: hashedPassword,
        role: 'User',
        createdAt: new Date(),
        licenseKey: licenseKey,
        hwid: hwid || 'NOT_SET'
      };

      const result = await db.collection('users').insertOne(newUser);

      // 5. Ativar licença
      await db.collection('licenses').updateOne(
        { key: licenseKey },
        {
          $set: {
            status: 'Ativa',
            activatedAt: new Date(),
            userId: result.insertedId,
            hwid: hwid || 'NOT_SET'
          }
        }
      );

      // 6. Gerar Token JWT
      const token = jwt.sign(
        { userId: result.insertedId, username: newUser.username, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return NextResponse.json({
        success: true,
        message: 'Conta criada com sucesso!',
        token,
        user: { username: newUser.username, role: newUser.role }
      }, { status: 201 });
    }

    // LOGIN
    if (action === 'login') {
      if (!username || !password) {
        return NextResponse.json({ message: 'Preencha usuário e senha' }, { status: 400 });
      }

      // 1. Buscar usuário
      const user = await db.collection('users').findOne({ username: username.toLowerCase() });
      if (!user) {
        return NextResponse.json({ message: 'Usuário ou senha incorretos' }, { status: 400 });
      }

      // 2. Comparar senha
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: 'Usuário ou senha incorretos' }, { status: 400 });
      }

      // 3. Gerar Token JWT
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return NextResponse.json({
        success: true,
        message: 'Autenticado com sucesso!',
        token,
        user: { username: user.username, role: user.role }
      }, { status: 200 });
    }

    return NextResponse.json({ message: 'Ação inválida' }, { status: 400 });

  } catch (error: any) {
    console.error('Erro na API Auth:', error);
    return NextResponse.json({ message: 'Erro interno do servidor', error: error.message }, { status: 500 });
  }
}
