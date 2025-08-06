import { Request, Response } from 'express';
import pool from '../models';
import asyncHandler from 'express-async-handler';

export const getResourceById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await pool.query('SELECT id, name, service, url, category_id FROM resources WHERE id = $1', [id]);
    if (result.rows.length > 0) {
        res.json(result.rows[0]);
    } else {
        res.status(404).json({ error: 'Ресурс не найден' });
    }
});

export const createResource = asyncHandler(async (req: Request, res: Response) => {
    const { name, service, url, category_id } = req.body;
    const result = await pool.query(
        'INSERT INTO resources (name, service, url, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, service, url, category_id]
    );
    res.status(201).json(result.rows[0]);
});

export const updateResource = asyncHandler(async (req: Request, res: Response) => {
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
});

export const deleteResource = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM resources WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
        res.json({ message: 'Ресурс успешно удален' });
    } else {
        res.status(404).json({ error: 'Ресурс не найден' });
    }
});

export default {
    getResourceById,
    createResource,
    updateResource,
    deleteResource
};
