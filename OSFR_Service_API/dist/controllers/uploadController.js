"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = process.env.UPLOAD_DIR || path_1.default.join(__dirname, '../../uploads');
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, 'image-' + uniqueSuffix + ext);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Разрешены только изображения'));
        }
    }
});
const uploadImage = (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Ошибка загрузки:', err);
            return res.status(400).json({
                error: err instanceof multer_1.default.MulterError
                    ? err.message
                    : 'Неверный тип файла'
            });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Файл не был загружен' });
        }
        const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
        const fileUrl = `${serverUrl}/uploads/${path_1.default.basename(req.file.path)}`;
        res.json({
            url: fileUrl,
            filename: req.file.filename,
            originalname: req.file.originalname
        });
    });
};
exports.uploadImage = uploadImage;
const deleteImage = (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL изображения не предоставлен' });
    }
    const filename = path_1.default.basename(url);
    const filePath = path_1.default.join(uploadDir, filename);
    if (!fs_1.default.existsSync(filePath)) {
        return res.status(404).json({ error: 'Файл не найден' });
    }
    fs_1.default.unlink(filePath, (err) => {
        if (err) {
            console.error(`Ошибка при удалении файла ${filePath}:`, err);
            return res.status(500).json({ error: 'Ошибка при удалении файла' });
        }
        res.status(200).json({ message: 'Файл успешно удалён' });
    });
};
exports.deleteImage = deleteImage;
