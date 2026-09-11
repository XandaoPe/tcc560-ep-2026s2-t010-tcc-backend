import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI || '';
        if (!mongoUri) {
            throw new Error('MONGO_URI não está definida nas variáveis de ambiente.');
        }
        await mongoose.connect(mongoUri);
        console.log('MongoDB Conectado com sucesso ao Atlas.');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
};