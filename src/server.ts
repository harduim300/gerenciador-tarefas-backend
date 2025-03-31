import  express, { RequestHandler }  from "express";
import dotenv from "dotenv";
import helmet from "helmet"
import path from "path";
import router from "./routes";
import cookieParser from 'cookie-parser';
import { errorHandler, NotFoundRequest } from "./routes/errorHandler.routes";
import cors from 'cors';

dotenv.config()
const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin: [ 'https://frontend-project-watch.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use('/', router);

app.use(NotFoundRequest)
app.use(errorHandler)

app.options('*', cors());

app.listen(3000, () => {
    console.log("--------------------------------")
    console.log("Servidor está rodando em http://localhost:3000")
    console.log("--------------------------------")
});