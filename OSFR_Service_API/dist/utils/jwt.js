"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function generateToken(userId, options) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET не задан в .env');
    }
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        ...options
    });
}
