import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Por favor, adicione a variável MONGODB_URI no seu .env ou nas configurações da Vercel');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Em desenvolvimento, usa cache global para evitar esgotamento de conexões
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Em produção, cria uma nova conexão padrão para o ambiente serverless
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
export async function getDb(dbName = 'kaze_auth') {
  const client = await clientPromise;
  return client.db(dbName);
}
