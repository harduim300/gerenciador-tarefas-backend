import { z } from "zod";

export const authSigninSchema = z.object({
  email: z.string({ message: "Campo email é obrigatório" }).email({ message: "Email inválido" }),
  password: z.string({ message: "Campo senha é obrigatório" }).min(8, { message: "Senha deve conter pelo menos 8 caracteres" }),
});

export type SigninData = z.infer<typeof authSigninSchema>;