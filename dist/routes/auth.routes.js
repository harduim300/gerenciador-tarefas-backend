"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../components/Auth/controller/AuthController");
const jwt_1 = require("../libs/jwt");
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
// 🔹 Rotas públicas
router.post('/login', authController.signin.bind(authController));
router.post('/signup', authController.signup.bind(authController));
// 🔹 Rota privada (precisa de token para deslogar)
router.post('/logout', jwt_1.verifyJWT, authController.logout.bind(authController));
exports.default = router;
