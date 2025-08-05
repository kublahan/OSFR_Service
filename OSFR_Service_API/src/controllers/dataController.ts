import { Request, Response } from 'express';
import pool from '../models';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT id, name FROM categories');
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


export const getResourceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM resources WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Ресурс не найден' });
        }
    } catch (err) {
        console.error('Ошибка при получении ресурса:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};


export const createResource = async (req: Request, res: Response) => {
    try {
        const { name, service, url, category_id } = req.body;
        const result = await pool.query(
            'INSERT INTO resources (name, service, url, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, service, url, category_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Ошибка при создании ресурса:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const updateResource = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, service, url, category_id } = req.body;
        const result = await pool.query(
            'UPDATE resources SET name = $1, service = $2, url = $3, category_id = $4 WHERE id = $5 RETURNING *',
            [name, service, url, category_id, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Ресурс не найден' });
        }
    } catch (err) {
        console.error('Ошибка при обновлении ресурса:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};


export const deleteResource = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM resources WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.json({ message: 'Ресурс успешно удален' });
        } else {
            res.status(404).json({ error: 'Ресурс не найден' });
        }
    } catch (err) {
        console.error('Ошибка при удалении ресурса:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};