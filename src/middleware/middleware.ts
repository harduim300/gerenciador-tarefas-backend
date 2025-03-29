import { RequestHandler } from "express";

export const middlewareIntercept: RequestHandler = (req, res, next) => {
    let logged = true;
    console.log("paramretos", req.params)
    console.log("query", req.query)
    console.log("body", req.body)
    if (logged) {
        console.log("Parabens você esta logado")
        next()
    } else {
        res.status(402).json({error: "Voce nao esta logado"})
    }
}