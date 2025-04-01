"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = exports.errorHandler = exports.NotFoundRequest = void 0;
const NotFoundRequest = (req, res) => {
    res.status(404).json({ error: "Route not found" });
};
exports.NotFoundRequest = NotFoundRequest;
const errorHandler = (err, req, res, next) => {
    res.status(500).json({ error: "Ocorreu um erro" });
};
exports.errorHandler = errorHandler;
const corsMiddleware = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "https://gerenciador-tarefas-frontend-one.vercel.app");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }
    next();
};
exports.corsMiddleware = corsMiddleware;
