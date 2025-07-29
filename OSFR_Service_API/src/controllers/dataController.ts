import { Request, Response } from 'express';
import pool from '../models';

export const getCategories = async (req: Request, res: Response) => {
    try {
        // Используем правильное имя столбца (category_id вместо category)
        const result = await pool.query('SELECT DISTINCT category_id FROM resources');
        res.json(result.rows.map(row => row.category_id));
    } catch (err) {
        console.error('Ошибка при получении категорий:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

// Для получения элементов
export const getAllItems = async (req: Request, res: Response) => {
    const { category } = req.query;
    console.log('Fetching items, category filter:', category); // Добавьте эту строку

    try {
        let query = 'SELECT * FROM resources';
        const params = [];

        if (category) {
            query += ' WHERE category_id = $1';  // Исправлено на category_id
            params.push(category);
        }

        console.log('Executing query:', query, params); // И эту
        const result = await pool.query(query, params);
        console.log('Query result:', result.rows); // И эту

        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении элементов:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};