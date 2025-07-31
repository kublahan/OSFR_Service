import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';


dotenv.config();


const publicRoutes = require('./routes/public').default;
const adminRoutes = require('./routes/admin').default;

const app = express();


app.use(helmet());


app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));


app.use(express.json({ limit: '10kb' }));


app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);


app.use(notFoundHandler);
app.use(errorHandler);

export default app;