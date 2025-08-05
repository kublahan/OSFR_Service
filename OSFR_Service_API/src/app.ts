import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { AppDataSource } from './config/data-source';


dotenv.config();


const publicRoutes = require('./routes/public').default;
const adminRoutes = require('./routes/admin').default;

const app = express();


app.use(helmet());


app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));


app.use(express.json({ limit: '10kb' }));

app.use((req, res, next) => {
  if (!AppDataSource.isInitialized) {
    return res.status(503).json({ msg: 'Сервер недоступен, база данных не инициализирована' });
  }
  next();
});


app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);


app.use(notFoundHandler);
app.use(errorHandler);

export default app;