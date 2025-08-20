import { Admin } from '@/entity/Admin';
import { Request, Response } from 'express';
import { AppDataSource } from '@/config/data-source';
import { generateToken } from '@/utils/jwt';

export const loginAdmin = async (req: any, res: any) => {
    const { username, password } = req.body;
    
    try {


        const admin = await AppDataSource.getRepository(Admin)
            .createQueryBuilder("admin")
            .where("LOWER(admin.username) = LOWER(:username)", { username })
            .getOne();


        if (!admin) {
            res.status(401).json({ msg: 'Неверные учетные данные' });
            return;
        }


        if (admin.password !== password) {
            res.status(401).json({ msg: 'Неверные учетные данные' });
            return;
        }

        const token = generateToken(admin.id.toString());
        res.json({ token });

    } catch (error) {
        console.error('[AUTH] Ошибка:', error);
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
};