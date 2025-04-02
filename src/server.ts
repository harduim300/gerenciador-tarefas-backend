import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsMiddleware, errorHandler, NotFoundRequest } from "./routes/errorHandler.routes";
import router from "./routes";

dotenv.config();

const app = express();
app.use(cors({
    origin: "https://gerenciador-tarefas-frontend-one.vercel.app",
    credentials: true
}))
app.get("/", (req, res) => {
    res.send("Seja bem vindo ao Gerenciador de Tarefas");
});
app.use(cookieParser());
app.use(express.json());
app.use(helmet());


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