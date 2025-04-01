import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler, NotFoundRequest } from "./routes/errorHandler.routes";
import router from "./routes";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.options("/", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://gerenciador-tarefas-frontend-one.vercel.app");
    next()
    res.status(200).send();
});

// 🔹 Proteção extra
app.use(helmet());

// 🔹 Parse de cookies e JSON
app.use(cookieParser());
app.use(express.json());

// 🔹 Definição de rotas
app.use("/", router);

// 🔹 Middleware para rotas não encontradas (404)
app.use(NotFoundRequest);

// 🔹 Middleware de tratamento de erros
app.use(errorHandler);


app.listen(3000, () => {
    console.log("--------------------------------");
    console.log("Servidor está rodando em http://localhost:3000");
    console.log("--------------------------------");
});
