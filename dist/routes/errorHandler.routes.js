"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.NotFoundRequest = void 0;
const NotFoundRequest = (req, res) => {
    res.status(404).json({ error: "Route not found" });
};
exports.NotFoundRequest = NotFoundRequest;
const errorHandler = (err, req, res, next) => {
    res.status(500).json({ error: "Ocorreu um erro" });
};
exports.errorHandler = errorHandler;
