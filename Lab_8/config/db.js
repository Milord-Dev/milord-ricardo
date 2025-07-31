// config/db.js
import mongoose from 'mongoose';
import 'dotenv/config'; // Si usas dotenv, aunque con pnpm podrías no necesitarlo directamente

const mongoURI = process.env.MONGODB_URI || "mongodb+srv://castulocastillo28:dilva2828@cluster0.482vata.mongodb.net/tiendita?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error.message);
    process.exit(1); // Sale de la aplicación si falla la conexión
  }
};

export { connectDB };