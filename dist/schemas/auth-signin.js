"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSigninSchema = void 0;
const zod_1 = require("zod");
exports.authSigninSchema = zod_1.z.object({
    email: zod_1.z.string({ message: "Campo email é obrigatório" }).email({ message: "Email inválido" }),
    password: zod_1.z.string({ message: "Campo senha é obrigatório" }).min(8, { message: "Senha deve conter pelo menos 8 caracteres" }),
});
