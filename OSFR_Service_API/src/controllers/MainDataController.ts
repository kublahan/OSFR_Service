import { Request, Response } from 'express';
import pool from '../models';
import asyncHandler from 'express-async-handler';

export const getAllItems = asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.query;
    let categoryId: number | null = null;

    if (category) {
        const categoryResult = await pool.query('SELECT id FROM categories WHERE name = $1', [category]);
        if (categoryResult.rows.length > 0) {
            categoryId = categoryResult.rows[0].id;
        } else {
            res.status(404).json({ error: 'Категория не найдена' });
            return;
        }
    }

    let allItems: any[] = [];


    let resourcesQuery = 'SELECT id, name, service, url, category_id FROM resources';
    let resourcesParams: any[] = [];
    if (categoryId !== null) {
        resourcesQuery += ' WHERE category_id = $1';
        resourcesParams.push(categoryId);
    }
    const resourcesResult = await pool.query(resourcesQuery, resourcesParams);
    const resources = resourcesResult.rows.map(item => ({ ...item, type: 'resource' }));
    allItems = allItems.concat(resources);


    let instructionsQuery = 'SELECT id, title as name, content, category_id FROM instructions';
    let instructionsParams: any[] = [];
    if (categoryId !== null) {
        instructionsQuery += ' WHERE category_id = $1';
        instructionsParams.push(categoryId);
    }
    const instructionsResult = await pool.query(instructionsQuery, instructionsParams);
    const instructions = instructionsResult.rows.map(item => ({ ...item, type: 'instruction', service: null, url: null }));
    allItems = allItems.concat(instructions);


    let softwareQuery = 'SELECT id, category_id, name, description, file_path FROM software';
    let softwareParams: any[] = [];
    if (categoryId !== null) {
        softwareQuery += ' WHERE category_id = $1';
        softwareParams.push(categoryId);
    }
    const softwareResult = await pool.query(softwareQuery, softwareParams);
    const software = softwareResult.rows.map(item => ({ ...item, type: 'software' }));
    allItems = allItems.concat(software);

    res.json(allItems);
});