"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = void 0;
const models_1 = __importDefault(require("../models"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.getCategories = (0, express_async_handler_1.default)(async (req, res) => {
    const result = await models_1.default.query(`
  SELECT id, name
  FROM categories
  ORDER BY
    CASE
      WHEN id IN (5, 6) THEN 1
      ELSE 0
    END,
    name ASC;
`);
    res.json(result.rows);
});
