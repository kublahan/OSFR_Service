import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppDataSource } from '@/config/data-source';
import { Admin } from '@/entity/Admin';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      admin?: Admin;
    }
  }
}


export const verifyToken = (token: string): { userId: string } => {
  if (!process.env.JWT_SECRET) {
    console.error('[AUTH] Критическая ошибка: JWT_SECRET не настроен в переменных окружения.');
    throw new Error('JWT_SECRET не настроен в переменных окружения');
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    console.error('[AUTH] Ошибка верификации токена:', error);
    throw new Error('Недействительный или истекший токен');
  }
};

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  if (!AppDataSource.isInitialized) {
    console.error('[AUTH] Ошибка: AppDataSource не инициализирован!');
    return res.status(500).json({ msg: 'Ошибка сервера: база данных не готова' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      msg: 'Токен авторизации отсутствует или имеет неверный формат. Используйте схему Bearer'
    });
  }

  const token = authHeader.split(' ')[1];

  try {

    const { userId } = verifyToken(token);

    const adminRepository = AppDataSource.getRepository(Admin);

    const admin = await adminRepository.findOneBy({
      id: parseInt(userId, 10)
    });

    if (!admin) {
      return res.status(401).json({
        msg: 'Администратор не найден'
      });
    }

    req.admin = admin;
    next();

  } catch (error) {
    console.error('[AUTH] Ошибка в adminAuthMiddleware:', error);

    const errorMessage = error instanceof Error
      ? error.message
      : 'Произошла неизвестная ошибка авторизации';

    return res.status(401).json({
      msg: errorMessage
    });
  }
};
