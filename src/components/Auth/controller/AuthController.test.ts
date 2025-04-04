import { NextFunction, Request, Response } from "express";
import { AuthController } from "./AuthController";

describe("AuthController Tests", () => {
    // cria um authController
    let authController: AuthController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password"
    };

    beforeEach(() => {
        authController = new AuthController();
    });
    
});
