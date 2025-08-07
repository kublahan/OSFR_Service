import { Request, Response } from 'express';
import pool from '../models';
import asyncHandler from 'express-async-handler';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query('SELECT id, name FROM categories');
    res.json(result.rows);
});

