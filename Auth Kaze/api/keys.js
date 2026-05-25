import clientPromise from './db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

// Helper para autenticar e verificar permissões
async function verifyUser(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

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

  const user = await verifyUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Acesso não autorizado. Faça login novamente.' });
  }

  const client = await clientPromise;
  const db = client.db('kaze_auth');

  // LISTAR LICENÇAS (Staff e CEO podem ver)
  if (req.method === 'GET') {
    try {
      const licenses = await db.collection('licenses').find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ success: true, licenses });
    } catch (e) {
      return res.status(500).json({ message: 'Erro ao buscar licenças', error: e.message });
    }
  }

  // GERAR OU RESETAR HWID
  if (req.method === 'POST') {
    const { action, plan, duration, key } = req.body;

    // Ação: Resetar HWID (Staff ou CEO podem fazer)
    if (action === 'reset_hwid') {
      if (!key) {
        return res.status(400).json({ message: 'Especifique a licença para resetar' });
      }

      try {
        const license = await db.collection('licenses').findOne({ key });
        if (!license) {
          return res.status(404).json({ message: 'Licença não encontrada' });
        }

        // Reseta o HWID no banco
        await db.collection('licenses').updateOne(
          { key },
          { $set: { hwid: 'NOT_SET' } }
        );

        // Também reseta no usuário correspondente se estiver vinculado
        await db.collection('users').updateOne(
          { licenseKey: key },
          { $set: { hwid: 'NOT_SET' } }
        );

        return res.status(200).json({ success: true, message: 'HWID resetado com sucesso!' });
      } catch (e) {
        return res.status(500).json({ message: 'Erro ao resetar HWID', error: e.message });
      }
    }

    // Ação: Gerar Chave (Apenas CEO pode fazer)
    if (action === 'generate') {
      if (user.role !== 'CEO') {
        return res.status(403).json({ message: 'Permissão negada. Apenas CEO pode gerar chaves.' });
      }

      if (!plan || !duration) {
        return res.status(400).json({ message: 'Falta especificar o plano e duração' });
      }

      try {
        // Gerar string aleatória
        const rand = (len) => {
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
        return res.status(201).json({ success: true, key: keyGenerated, license: newLicense });
      } catch (e) {
        return res.status(500).json({ message: 'Erro ao gerar licença', error: e.message });
      }
    }
  }

  // REVOGAR LICENÇA (Apenas CEO)
  if (req.method === 'DELETE') {
    const { key } = req.body;
    if (user.role !== 'CEO') {
      return res.status(403).json({ message: 'Permissão negada. Apenas CEO pode revogar chaves.' });
    }

    if (!key) {
      return res.status(400).json({ message: 'Falta especificar a chave' });
    }

    try {
      // Deletar a licença
      await db.collection('licenses').deleteOne({ key });
      // Remover a chave e resetar do usuário correspondente
      await db.collection('users').deleteOne({ licenseKey: key });

      return res.status(200).json({ success: true, message: 'Licença revogada com sucesso!' });
    } catch (e) {
      return res.status(500).json({ message: 'Erro ao revogar licença', error: e.message });
    }
  }

  return res.status(405).json({ message: 'Método não permitido' });
}
