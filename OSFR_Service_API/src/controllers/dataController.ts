import { Request, Response } from 'express';
import pool from '../models';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT DISTINCT category FROM resources');
        res.json(result.rows.map(row => row.category));
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllItems = async (req: Request, res: Response) => {
    const { category } = req.query;

    try {
        let query = 'SELECT * FROM resources';
        const params = [];

        if (category) {
            query += 'WHERE category = $1';
            params.push(category);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};