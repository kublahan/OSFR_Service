"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInstruction = exports.updateInstruction = exports.createInstruction = exports.getInstructionById = exports.getInstructions = void 0;
const models_1 = __importDefault(require("../models"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dompurify_1 = __importDefault(require("dompurify"));
const jsdom_1 = require("jsdom");
const window = new jsdom_1.JSDOM('').window;
const domPurify = (0, dompurify_1.default)(window);
exports.getInstructions = (0, express_async_handler_1.default)(async (req, res, next) => {
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
        const result = await models_1.default.query(query, params);
        res.json(result.rows);
    }
    catch (err) {
        next(err);
    }
});
exports.getInstructionById = (0, express_async_handler_1.default)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await models_1.default.query(`SELECT 
                i.id, 
                i.title, 
                i.content, 
                i.category_id,
                c.name as category_name
             FROM instructions i
             LEFT JOIN categories c ON i.category_id = c.id
             WHERE i.id = $1`, [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Instruction not found' });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        next(err);
    }
});
exports.createInstruction = (0, express_async_handler_1.default)(async (req, res, next) => {
    try {
        const { title, content, category_id } = req.body;
        console.log('Received payload for creating instruction:', { title, content, category_id });
        if (!title || !content || !category_id) {
            res.status(400).json({ error: 'Missing required fields: title, content, and category_id are required.' });
            return;
        }
        const cleanContent = domPurify.sanitize(content);
        const result = await models_1.default.query(`INSERT INTO instructions (title, content, category_id)
             VALUES ($1, $2, $3)
             RETURNING id, title, content, category_id`, [title, cleanContent, category_id]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error('Error in createInstruction:', err);
        next(err);
    }
});
exports.updateInstruction = (0, express_async_handler_1.default)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, category_id } = req.body;
        if (!title || !content || !category_id) {
            res.status(400).json({ error: 'Missing required fields: title, content, and category_id are required.' });
            return;
        }
        const cleanContent = domPurify.sanitize(content);
        const result = await models_1.default.query(`UPDATE instructions
             SET title = $1, content = $2, category_id = $3
             WHERE id = $4
             RETURNING id, title, content, category_id`, [title, cleanContent, category_id, id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Instruction not found' });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error('Error in updateInstruction:', err);
        next(err);
    }
});
exports.deleteInstruction = (0, express_async_handler_1.default)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await models_1.default.query('DELETE FROM instructions WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Instruction not found' });
            return;
        }
        res.json({
            success: true,
            message: 'Instruction deleted successfully',
            deletedId: id
        });
    }
    catch (err) {
        next(err);
    }
});
const instructionController = {
    getInstructions: exports.getInstructions,
    getInstructionById: exports.getInstructionById,
    createInstruction: exports.createInstruction,
    updateInstruction: exports.updateInstruction,
    deleteInstruction: exports.deleteInstruction
};
exports.default = instructionController;
