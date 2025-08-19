"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = void 0;
const Admin_1 = require("@/entity/Admin");
const data_source_1 = require("@/config/data-source");
const jwt_1 = require("@/utils/jwt");
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await data_source_1.AppDataSource.getRepository(Admin_1.Admin)
            .createQueryBuilder("admin")
            .where("LOWER(admin.username) = LOWER(:username)", { username })
            .getOne();
        if (!admin) {
            return res.status(401).json({ msg: 'Неверные учетные данные' });
        }
        if (admin.password !== password) {
            return res.status(401).json({ msg: 'Неверные учетные данные' });
        }
        const token = (0, jwt_1.generateToken)(admin.id.toString());
        return res.json({ token });
    }
    catch (error) {
        console.error('[AUTH] Ошибка:', error);
        return res.status(500).json({ msg: 'Ошибка сервера' });
    }
};
exports.loginAdmin = loginAdmin;
