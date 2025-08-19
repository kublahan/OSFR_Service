"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllItems = void 0;
const models_1 = __importDefault(require("../models"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.getAllItems = (0, express_async_handler_1.default)(async (req, res) => {
    const { category } = req.query;
    let categoryId = null;
    if (category) {
        const categoryResult = await models_1.default.query('SELECT id FROM categories WHERE name = $1', [category]);
        if (categoryResult.rows.length > 0) {
            categoryId = categoryResult.rows[0].id;
        }
        else {
            res.status(404).json({ error: 'Категория не найдена' });
            return;
        }
    }
    let allItems = [];
    let resourcesQuery = 'SELECT id, name, service, url, category_id FROM resources';
    let resourcesParams = [];
    if (categoryId !== null) {
        resourcesQuery += ' WHERE category_id = $1';
        resourcesParams.push(categoryId);
    }
    const resourcesResult = await models_1.default.query(resourcesQuery, resourcesParams);
    const resources = resourcesResult.rows.map(item => ({ ...item, type: 'resource' }));
    allItems = allItems.concat(resources);
    let instructionsQuery = 'SELECT id, title as name, content, category_id FROM instructions';
    let instructionsParams = [];
    if (categoryId !== null) {
        instructionsQuery += ' WHERE category_id = $1';
        instructionsParams.push(categoryId);
    }
    const instructionsResult = await models_1.default.query(instructionsQuery, instructionsParams);
    const instructions = instructionsResult.rows.map(item => ({ ...item, type: 'instruction', service: null, url: null }));
    allItems = allItems.concat(instructions);
    let softwareQuery = 'SELECT id, category_id, name, description, file_path FROM software';
    let softwareParams = [];
    if (categoryId !== null) {
        softwareQuery += ' WHERE category_id = $1';
        softwareParams.push(categoryId);
    }
    const softwareResult = await models_1.default.query(softwareQuery, softwareParams);
    const software = softwareResult.rows.map(item => ({ ...item, type: 'software' }));
    allItems = allItems.concat(software);
    res.json(allItems);
});
