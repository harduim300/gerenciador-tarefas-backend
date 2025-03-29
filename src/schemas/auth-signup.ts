import { z } from "zod";

export const authSignupSchema = z.object({
  name: z.string().min(3, { message: "Campo nome é obrigatório" }),
  email: z.string({ message: "Campo email é obrigatório" }).email({ message: "Email inválido" }),
  password: z.string().min(8, { message: "Senha deve conter pelo menos 8 caracteres" }),
});

export type SignupData = z.infer<typeof authSignupSchema>;