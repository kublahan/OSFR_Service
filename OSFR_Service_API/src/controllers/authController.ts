import { Admin } from '@/entity/Admin';
import { Request, Response } from 'express';
import { AppDataSource } from '@/config/data-source';
import { generateToken } from '@/utils/jwt';

export const loginAdmin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    console.log(`[AUTH] Поиск пользователя: ${username}`);
    
    try {


        const admin = await AppDataSource.getRepository(Admin)
            .createQueryBuilder("admin")
            .where("LOWER(admin.username) = LOWER(:username)", { username })
            .getOne();


        if (!admin) {
            return res.status(401).json({ msg: 'Неверные учетные данные' });
        }

        // Временная проверка пароля без хэширования
        if (admin.password !== password) {
            return res.status(401).json({ msg: 'Неверные учетные данные' });
        }

        const token = generateToken(admin.id.toString());
        return res.json({ token });

    } catch (error) {
        console.error('[AUTH] Ошибка:', error);
        return res.status(500).json({ msg: 'Ошибка сервера' });
    }
};