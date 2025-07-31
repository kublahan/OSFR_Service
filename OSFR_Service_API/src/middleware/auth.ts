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

export const verifyToken = (token: string): { adminId: string } => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET не настроен в переменных окружения');
  }
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET) as { adminId: string };
  } catch (error) {
    throw new Error('Недействительный или истекший токен');
  }
};

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ 
      msg: 'Токен авторизации отсутствует' 
    });
  }


  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ 
      msg: 'Неверный формат токена. Используйте схему Bearer' 
    });
  }

  try {

    const { adminId } = verifyToken(token);
    

    const adminRepository = AppDataSource.getRepository(Admin);
    const admin = await adminRepository.findOneBy({ 
      id: parseInt(adminId) 
    });
    
    if (!admin) {
      return res.status(401).json({ 
        msg: 'Администратор не найден' 
      });
    }
    

    req.admin = admin;
    next();
    
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Произошла неизвестная ошибка авторизации';
    
    return res.status(401).json({ 
      msg: errorMessage 
    });
  }
};