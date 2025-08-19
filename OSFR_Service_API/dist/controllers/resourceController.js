"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResource = exports.updateResource = exports.createResource = exports.getResourceById = void 0;
const models_1 = __importDefault(require("../models"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.getResourceById = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await models_1.default.query('SELECT id, name, service, url, category_id FROM resources WHERE id = $1', [id]);
    if (result.rows.length > 0) {
        res.json(result.rows[0]);
    }
    else {
        res.status(404).json({ error: 'Ресурс не найден' });
    }
});
exports.createResource = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, service, url, category_id } = req.body;
    const result = await models_1.default.query('INSERT INTO resources (name, service, url, category_id) VALUES ($1, $2, $3, $4) RETURNING *', [name, service, url, category_id]);
    res.status(201).json(result.rows[0]);
});
exports.updateResource = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { name, service, url, category_id } = req.body;
    const result = await models_1.default.query('UPDATE resources SET name = $1, service = $2, url = $3, category_id = $4 WHERE id = $5 RETURNING *', [name, service, url, category_id, id]);
    if (result.rows.length > 0) {
        res.json(result.rows[0]);
    }
    else {
        res.status(404).json({ error: 'Ресурс не найден' });
    }
});
exports.deleteResource = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await models_1.default.query('DELETE FROM resources WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
        res.json({ message: 'Ресурс успешно удален' });
    }
    else {
        res.status(404).json({ error: 'Ресурс не найден' });
    }
});
exports.default = {
    getResourceById: exports.getResourceById,
    createResource: exports.createResource,
    updateResource: exports.updateResource,
    deleteResource: exports.deleteResource
};
