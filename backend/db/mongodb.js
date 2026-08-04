import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('../.env', import.meta.url) });

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not configured. Add your MongoDB Atlas connection string to backend/.env.');
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`[db] connected to MongoDB (${mongoose.connection.name})`);
}

export default mongoose;
