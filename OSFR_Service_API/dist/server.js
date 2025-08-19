"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const data_source_1 = require("./config/data-source");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
async function startServer() {
    try {
        await data_source_1.AppDataSource.initialize();
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on http://${HOST}:${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start:', error);
        process.exit(1);
    }
}
startServer();
