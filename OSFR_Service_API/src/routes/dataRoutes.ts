import { Router } from "express";
import { getCategories, getAllItems } from '@/controllers/dataController';
import asyncHandler from 'express-async-handler';


const router = Router();
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', asyncHandler(getCategories));

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items with optional filtering
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of filtered items
 */
router.get('/items', asyncHandler(getAllItems));

export default router;