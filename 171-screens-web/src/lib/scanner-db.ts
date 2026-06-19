import { getMongoClient } from "./mongodb";

const SCANNER_DB = "171screens";

export async function getScannerDb() {
  const client = await getMongoClient();
  return client.db(SCANNER_DB);
}
