"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_routes_1 = require("./routes/errorHandler.routes");
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
    res.header("Access-Control-Allow-Methods", "GET,DELETE,POST,PUT,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }
    next();
});
app.get("/", (req, res) => {
    res.send("Seja bem vindo ao Gerenciador de Tarefas");
});
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use("/", routes_1.default);
// 🔹 Middleware para rotas não encontradas (404)
app.use(errorHandler_routes_1.NotFoundRequest);
// 🔹 Middleware de tratamento de erros
app.use(errorHandler_routes_1.errorHandler);
app.listen(3000, () => {
    console.log("--------------------------------");
    console.log("Servidor está rodando em http://localhost:3000");
    console.log("--------------------------------");
});
