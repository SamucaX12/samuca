import clientPromise from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

async function verifyCEO(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'CEO') return decoded;
    return null;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  // CORS
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

  const ceo = await verifyCEO(req);
  if (!ceo) {
    return res.status(403).json({ message: 'Apenas administradores de nível CEO podem gerenciar a equipe.' });
  }

  const client = await clientPromise;
  const db = client.db('kaze_auth');

  // LISTAR MEMBROS DA STAFF
  if (req.method === 'GET') {
    try {
      const team = await db.collection('users')
        .find({ role: { $in: ['Staff', 'CEO'] } })
        .project({ password: 0 })
        .toArray();
      return res.status(200).json({ success: true, team });
    } catch (e) {
      return res.status(500).json({ message: 'Erro ao buscar equipe', error: e.message });
    }
  }

  // ADICIONAR MEMBRO DA STAFF
  if (req.method === 'POST') {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Preencha usuário, senha e cargo' });
    }

    try {
      const existingUser = await db.collection('users').findOne({ username: username.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Nome de usuário já cadastrado' });
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
      return res.status(201).json({ success: true, message: `Membro ${username} adicionado como ${role}!` });
    } catch (e) {
      return res.status(500).json({ message: 'Erro ao adicionar staff', error: e.message });
    }
  }

  // REMOVER MEMBRO DA STAFF
  if (req.method === 'DELETE') {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Falta especificar o usuário' });
    }

    if (username.toLowerCase() === ceo.username.toLowerCase()) {
      return res.status(400).json({ message: 'Você não pode revogar seu próprio acesso de CEO.' });
    }

    try {
      await db.collection('users').deleteOne({ username: username.toLowerCase() });
      return res.status(200).json({ success: true, message: 'Acesso revogado com sucesso!' });
    } catch (e) {
      return res.status(500).json({ message: 'Erro ao remover membro', error: e.message });
    }
  }

  return res.status(405).json({ message: 'Método não permitido' });
}
