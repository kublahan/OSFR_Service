import { Request, Response, NextFunction } from 'express';
import pool from '../models';
import asyncHandler from 'express-async-handler';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import {
  Instruction,
  CreateInstructionBody,
  UpdateInstructionBody,
  InstructionController
} from '../types/instructions';

const window = new JSDOM('').window;
const domPurify = DOMPurify(window);

export const getInstructions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { category_id } = req.query;
    
    try {
        let query = `
            SELECT 
                i.id, 
                i.title, 
                i.content, 
                i.category_id,
                c.name as category_name
            FROM instructions i
            LEFT JOIN categories c ON i.category_id = c.id
        `;
        const params = [];

        if (category_id) {
            query += ' WHERE i.category_id = $1';
            params.push(category_id);
        }

        query += ' ORDER BY i.title ASC';

        const result = await pool.query<Instruction>(query, params);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

export const getInstructionById = asyncHandler(async (
  req: Request<{ id: string }>,
  res: Response<Instruction | { error: string }>,
  next: NextFunction
) => {
    try {
        const { id } = req.params;
        const result = await pool.query<Instruction>(
            `SELECT 
                i.id, 
                i.title, 
                i.content, 
                i.category_id,
                c.name as category_name
             FROM instructions i
             LEFT JOIN categories c ON i.category_id = c.id
             WHERE i.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Instruction not found' });
            return;
        }

        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

export const createInstruction = asyncHandler(async (
  req: Request<{}, any, CreateInstructionBody>,
  res: Response<Instruction | { error: string }>,
  next: NextFunction
) => {
    try {
        const { title, content, category_id } = req.body;
        
        console.log('Received payload for creating instruction:', { title, content, category_id });
        
        if (!title || !content || !category_id) {
            res.status(400).json({ error: 'Missing required fields: title, content, and category_id are required.' });
            return;
        }
        
        const cleanContent = domPurify.sanitize(content);

        const result = await pool.query<Instruction>(
            `INSERT INTO instructions (title, content, category_id)
             VALUES ($1, $2, $3)
             RETURNING id, title, content, category_id`,
            [title, cleanContent, category_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error in createInstruction:', err);
        next(err);
    }
});

export const updateInstruction = asyncHandler(async (
  req: Request<{ id: string }, any, UpdateInstructionBody>,
  res: Response<Instruction | { error: string }>,
  next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { title, content, category_id } = req.body;

        console.log('Received payload for updating instruction:', { id, title, content, category_id });
        
        if (!title || !content || !category_id) {
            res.status(400).json({ error: 'Missing required fields: title, content, and category_id are required.' });
            return;
        }

        const cleanContent = domPurify.sanitize(content);

        const result = await pool.query<Instruction>(
            `UPDATE instructions
             SET title = $1, content = $2, category_id = $3
             WHERE id = $4
             RETURNING id, title, content, category_id`,
            [title, cleanContent, category_id, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Instruction not found' });
            return;
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error in updateInstruction:', err);
        next(err);
    }
});

export const deleteInstruction = asyncHandler(async (
  req: Request<{ id: string }>,
  res: Response<{ success: boolean; message: string; deletedId: string } | { error: string }>,
  next: NextFunction
) => {
    try {
        const { id } = req.params;
        const result = await pool.query<{ id: number }>(
            'DELETE FROM instructions WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Instruction not found' });
            return;
        }

        res.json({ 
            success: true,
            message: 'Instruction deleted successfully',
            deletedId: id
        });
    } catch (err) {
        next(err);
    }
});

const instructionController: InstructionController = {
    getInstructions,
    getInstructionById,
    createInstruction,
    updateInstruction,
    deleteInstruction
};

export default instructionController;