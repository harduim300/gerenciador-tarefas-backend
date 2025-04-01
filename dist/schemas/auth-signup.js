"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSignupSchema = void 0;
const zod_1 = require("zod");
exports.authSignupSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, { message: "Campo nome é obrigatório" }),
    email: zod_1.z.string({ message: "Campo email é obrigatório" }).email({ message: "Email inválido" }),
    password: zod_1.z.string().min(8, { message: "Senha deve conter pelo menos 8 caracteres" }),
});
