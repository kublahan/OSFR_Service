import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { AppDataSource } from './config/data-source';
import path from 'path';


dotenv.config();


const publicRoutes = require('./routes/public').default;
const adminRoutes = require('./routes/admin').default;

const app = express();





app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['Content-Disposition'], 
}));


app.use(express.json({ limit: '10kb' }));


const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');


app.use('/uploads', express.static(uploadDir));




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