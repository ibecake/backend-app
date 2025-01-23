import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || ''; // Use the environment variable
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise; // Default export

// Optional: Named export for convenience
export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db('podcastapp'); // Explicitly reference your database name
}
