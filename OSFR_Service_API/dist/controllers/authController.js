"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = void 0;
const Admin_1 = require("../entity/Admin");
const data_source_1 = require("../config/data-source");
const jwt_1 = require("../utils/jwt");
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await data_source_1.AppDataSource.getRepository(Admin_1.Admin)
            .createQueryBuilder("admin")
            .where("LOWER(admin.username) = LOWER(:username)", { username })
            .getOne();
        if (!admin) {
            res.status(401).json({ msg: 'Неверные учетные данные' });
            return;
        }
        if (admin.password !== password) {
            res.status(401).json({ msg: 'Неверные учетные данные' });
            return;
        }
        const token = (0, jwt_1.generateToken)(admin.id.toString());
        res.json({ token });
    }
    catch (error) {
        console.error('[AUTH] Ошибка:', error);
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
};
exports.loginAdmin = loginAdmin;
