import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import dataRoutes from './routes/dataRoutes';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080'
}));



app.use(express.json({ limit: '10kb'}));

app.use('/api', dataRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use(notFoundHandler);

app.use(errorHandler);


export default app;