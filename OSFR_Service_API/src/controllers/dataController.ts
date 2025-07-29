import { Request, Response } from 'express';
import pool from '../models';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT id, name FROM categories ORDER BY name');
        console.log('Backend: Fetched categories:', result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении категорий:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};


export const getAllItems = async (req: Request, res: Response) => {
    const { category } = req.query;
    console.log('Fetching items, category filter:', category);

    try {
        let query = 'SELECT * FROM resources';
        const params = [];

        if (category) {
            query += ' WHERE category_id = $1';
            params.push(category);
        }

        console.log('Executing query:', query, params);
        const result = await pool.query(query, params);
        console.log('Query result:', result.rows);

        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении элементов:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};