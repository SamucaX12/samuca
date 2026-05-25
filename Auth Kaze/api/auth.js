import clientPromise from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { action, username, password, licenseKey, hwid } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db('kaze_auth');

    // REGISTRO
    if (action === 'register') {
      if (!username || !password || !licenseKey) {
        return res.status(400).json({ message: 'Preencha todos os campos obrigatórios' });
      }

      // 1. Validar chave de licença
      const license = await db.collection('licenses').findOne({ key: licenseKey });
      if (!license) {
        return res.status(400).json({ message: 'Chave de licença inválida' });
      }

      if (license.status === 'Ativa') {
        return res.status(400).json({ message: 'Esta licença já está em uso por outro usuário' });
      }

      // 2. Verificar se usuário já existe
      const existingUser = await db.collection('users').findOne({ username: username.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Nome de usuário já cadastrado' });
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

      return res.status(201).json({
        success: true,
        message: 'Conta criada com sucesso!',
        token,
        user: { username: newUser.username, role: newUser.role }
      });
    }

    // LOGIN
    if (action === 'login') {
      if (!username || !password) {
        return res.status(400).json({ message: 'Preencha usuário e senha' });
      }

      // 1. Buscar usuário
      const user = await db.collection('users').findOne({ username: username.toLowerCase() });
      if (!user) {
        return res.status(400).json({ message: 'Usuário ou senha incorretos' });
      }

      // 2. Comparar senha
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Usuário ou senha incorretos' });
      }

      // 3. Gerar Token JWT
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Autenticado com sucesso!',
        token,
        user: { username: user.username, role: user.role }
      });
    }

    return res.status(400).json({ message: 'Ação inválida' });

  } catch (error) {
    console.error('Erro na API Auth:', error);
    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
}
