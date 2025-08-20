"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Path ${req.originalUrl} not found`
    });
};
exports.default = notFoundHandler;
