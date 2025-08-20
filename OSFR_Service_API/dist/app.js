"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const notFoundHandler_1 = __importDefault(require("./middleware/notFoundHandler"));
const data_source_1 = require("./config/data-source");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const public_1 = __importDefault(require("./routes/public"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
}));
app.use(express_1.default.json({ limit: '10kb' }));
const uploadDir = process.env.UPLOAD_DIR || path_1.default.join(__dirname, '../uploads');
app.use('/uploads', express_1.default.static(uploadDir));
app.use((req, res, next) => {
    if (!data_source_1.AppDataSource.isInitialized) {
        return res.status(503).json({ msg: 'Сервер недоступен, база данных не инициализирована' });
    }
    next();
});
app.use('/api', public_1.default);
app.use('/api/admin', admin_1.default);
app.use(notFoundHandler_1.default);
app.use(errorHandler_1.default);
exports.default = app;
