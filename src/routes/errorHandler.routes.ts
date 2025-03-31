import { ErrorRequestHandler, RequestHandler } from "express"

export const NotFoundRequest: RequestHandler = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://gerenciador-tarefas-frontend-one.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(404).json({error: "Route not found"})
} 

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://gerenciador-tarefas-frontend-one.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(500).json({error: "Ocorreu um erro"})
}