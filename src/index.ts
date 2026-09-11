import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import thermalRoutes from './routes/thermalRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o Banco e Rotas
connectDB();
app.use('/api/thermal', thermalRoutes);

app.get('/', (_req, res) => {
    res.send('API do Gêmeo Digital - Injetora ROMI operando.');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});