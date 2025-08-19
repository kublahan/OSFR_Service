import { Request, Response } from 'express';
import pool from '../models';
import asyncHandler from 'express-async-handler';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query(`
  SELECT id, name
  FROM categories
  ORDER BY
    CASE
      WHEN id IN (5, 6) THEN 1
      ELSE 0
    END,
    name ASC;
`);
    res.json(result.rows);
});

