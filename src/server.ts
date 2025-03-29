import  express, { RequestHandler }  from "express";
import dotenv from "dotenv";
import helmet from "helmet"
import path from "path";
import router from "./routes";
import cookieParser from 'cookie-parser';
import { errorHandler, NotFoundRequest } from "./routes/errorHandler.routes";
import { middlewareIntercept } from "./middleware/middleware";

dotenv.config()
const app = express();
app.use(helmet());
app.use(express.json())
app.use(middlewareIntercept)
app.use(cookieParser());
app.use('/', router);
app.get('/marco', (req,res) => {
    res.json({response: "polo"})
});


app.use(NotFoundRequest)
app.use(errorHandler)


app.listen(3000, () => {
    console.log("--------------------------------")
    console.log("Servidor está rodando em http://localhost:3000")
    console.log("--------------------------------")
});