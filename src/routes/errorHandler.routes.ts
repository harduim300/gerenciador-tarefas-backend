import { ErrorRequestHandler, RequestHandler } from "express"

export const NotFoundRequest: RequestHandler = (req, res) => {
    res.status(404).json({error: "Route not found"})
} 

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(500).json({error: "Ocorreu um erro"})
}