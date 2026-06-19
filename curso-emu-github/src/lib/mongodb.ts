import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "cursoemu";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (!uri) throw new Error("MONGODB_URI not configured");
  const options = { serverSelectionTimeoutMS: 10000 };

  if (process.env.NODE_ENV === "development") {
    if (!client) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise!;
  }

  if (!clientPromise) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const c = await getMongoClient();
  return c.db(dbName);
}

export async function ensureIndexes() {
  const db = await getDb();
  await db.collection("users").createIndex({ discordId: 1 }, { unique: true });
  await db.collection("audit_logs").createIndex({ createdAt: -1 });
}
