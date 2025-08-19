"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthMiddleware = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const data_source_1 = require("@/config/data-source");
const Admin_1 = require("@/entity/Admin");
dotenv_1.default.config();
const verifyToken = (token) => {
    if (!process.env.JWT_SECRET) {
        console.error('[AUTH] Критическая ошибка: JWT_SECRET не настроен в переменных окружения.');
        throw new Error('JWT_SECRET не настроен в переменных окружения');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        console.error('[AUTH] Ошибка верификации токена:', error);
        throw new Error('Недействительный или истекший токен');
    }
};
exports.verifyToken = verifyToken;
const adminAuthMiddleware = async (req, res, next) => {
    if (!data_source_1.AppDataSource.isInitialized) {
        console.error('[AUTH] Ошибка: AppDataSource не инициализирован!');
        return res.status(500).json({ msg: 'Ошибка сервера: база данных не готова' });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            msg: 'Токен авторизации отсутствует или имеет неверный формат. Используйте схему Bearer'
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const { userId } = (0, exports.verifyToken)(token);
        const adminRepository = data_source_1.AppDataSource.getRepository(Admin_1.Admin);
        const admin = await adminRepository.findOneBy({
            id: parseInt(userId, 10)
        });
        if (!admin) {
            return res.status(401).json({
                msg: 'Администратор не найден'
            });
        }
        req.admin = admin;
        next();
    }
    catch (error) {
        console.error('[AUTH] Ошибка в adminAuthMiddleware:', error);
        const errorMessage = error instanceof Error
            ? error.message
            : 'Произошла неизвестная ошибка авторизации';
        return res.status(401).json({
            msg: errorMessage
        });
    }
};
exports.adminAuthMiddleware = adminAuthMiddleware;
