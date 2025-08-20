"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadSoftware = exports.deleteSoftware = exports.updateSoftware = exports.getSoftwarebyId = exports.createSoftware = exports.upload = void 0;
const models_1 = __importDefault(require("../models"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = process.env.SOFTWARE_DIR || path_1.default.join(__dirname, '..', '..', 'uploads', 'software');
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const name = req.body.name ? req.body.name.replace(/[^\p{L}\p{N}]/gu, '_') : 'software';
        const uniqueSuffix = Date.now();
        const fileExtension = path_1.default.extname(file.originalname);
        cb(null, `${name}_${uniqueSuffix}${fileExtension}`);
    }
});
exports.upload = (0, multer_1.default)({ storage: storage });
exports.createSoftware = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, description, category_id } = req.body;
    if (!req.file) {
        res.status(400).json({ error: 'Не удалось загрузить файл. Пожалуйста, убедитесь, что файл был выбран.' });
        return;
    }
    const filePath = req.file.path;
    if (!name || !category_id) {
        res.status(400).json({ error: 'Необходимо указать имя и категорию' });
        return;
    }
    const newSoftware = await models_1.default.query('INSERT INTO software (name, description, file_path, category_id) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, filePath, category_id]);
    res.status(201).json(newSoftware.rows[0]);
});
exports.getSoftwarebyId = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await models_1.default.query('SELECT id, category_id, name, description, file_path FROM software WHERE id = $1', [id]);
    if (result.rows.length > 0) {
        const item = result.rows[0];
        let fileName = null;
        if (item.file_path) {
            fileName = path_1.default.basename(item.file_path);
        }
        res.json({
            ...item,
            file_name: fileName,
        });
    }
    else {
        res.status(404).json({ error: 'ПО не найдено' });
    }
});
exports.updateSoftware = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { name, description, category_id } = req.body;
    const newFile = req.file;
    let filePath = null;
    let oldFilePath = null;
    const oldFileResult = await models_1.default.query('SELECT file_path FROM software WHERE id = $1', [id]);
    if (oldFileResult.rows.length > 0) {
        oldFilePath = oldFileResult.rows[0].file_path;
    }
    if (newFile) {
        filePath = newFile.path;
        if (oldFilePath) {
            fs_1.default.unlink(oldFilePath, (err) => {
                if (err) {
                    console.error(`Ошибка при удалении старого файла ${oldFilePath}:`, err);
                }
            });
        }
    }
    else {
        filePath = oldFilePath;
    }
    const updateQuery = `
        UPDATE software
        SET name = $1, description = $2, file_path = $3, category_id = $4
        WHERE id = $5
        RETURNING *;
    `;
    const updateValues = [name, description, filePath, category_id, id];
    const result = await models_1.default.query(updateQuery, updateValues);
    if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
    }
    else {
        res.status(404).json({ error: 'ПО не найдено для обновления' });
    }
});
exports.deleteSoftware = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const findResult = await models_1.default.query('SELECT file_path FROM software WHERE id = $1', [id]);
    if (findResult.rows.length === 0) {
        res.status(404).json({ error: 'ПО не найдено' });
        return;
    }
    const filePath = findResult.rows[0].file_path;
    const deleteResult = await models_1.default.query('DELETE FROM software WHERE id = $1 RETURNING *', [id]);
    if (deleteResult.rows.length === 0) {
        res.status(404).json({ error: 'ПО не найдено для удаления' });
        return;
    }
    if (filePath) {
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                console.error(`Ошибка при удалении файла ${filePath}:`, err);
            }
        });
    }
    res.status(200).json({ message: 'ПО успешно удалено' });
});
exports.downloadSoftware = (0, express_async_handler_1.default)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await models_1.default.query('SELECT file_path, name FROM software WHERE id = $1', [id]);
        if (result.rows.length === 0 || !result.rows[0].file_path) {
            res.status(404).json({ error: 'ПО не найдено' });
            return;
        }
        const filePath = result.rows[0].file_path;
        const originalFileName = path_1.default.basename(filePath);
        if (!fs_1.default.existsSync(filePath)) {
            res.status(404).json({ error: 'Файл не найден на сервере' });
            return;
        }
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(originalFileName)}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        const fileStream = fs_1.default.createReadStream(filePath);
        fileStream.pipe(res);
        fileStream.on('end', () => {
            res.end();
        });
        fileStream.on('error', (err) => {
            console.error('Ошибка при чтении файла:', err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Ошибка при чтении файла' });
            }
        });
    }
    catch (err) {
        next(err);
    }
});
