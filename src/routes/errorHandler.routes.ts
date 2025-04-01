import { ErrorRequestHandler, RequestHandler } from "express"
import { Request, Response, NextFunction } from "express";


export const NotFoundRequest: RequestHandler = (req, res) => {
    res.status(404).json({error: "Route not found"})
} 

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(500).json({error: "Ocorreu um erro"})
}

export const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin ||  "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
};
