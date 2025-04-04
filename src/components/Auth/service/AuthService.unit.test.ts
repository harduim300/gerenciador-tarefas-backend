import { AuthService } from "./AuthService";
import { prisma } from "../../../libs/prisma";
import argon2 from "argon2";

describe("AuthService", () => {
    let authService: AuthService;

    beforeAll( async () => {
        authService = new AuthService();
        await prisma.task.deleteMany();
        await prisma.user.deleteMany();

    });

    afterAll(async () => {
        await prisma.user.deleteMany();
        await prisma.task.deleteMany();
    });

    const user = {
        name: "Lucas Ribamar",
        email: "lucas.ribamar@example.com",
        password: "12345678"
    };

    
    it("should create a new user", async () => {
        const result = await authService.signup(user);
        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.name).toBe(user.name);
        expect(result.email).toBe(user.email);
        const verifyPassword = await argon2.verify(result.password, user.password);
        expect(verifyPassword).toBe(true);
    });

    it("should find a user by email", async () => {
        const result = await authService.findByEmail(user.email);
        expect(result).toBeDefined();
        expect(result?.id).toBeDefined();
        expect(result?.name).toBe(user.name);
        expect(result?.email).toBe(user.email);
    });

    it("should reject when email is not found", async () => {
        await expect(authService.findByEmail("wrong-email")).resolves.toBeNull()
    });

    it("should find a user by id", async () => {
        const userFound = await authService.findByEmail(user.email);

        const result = await authService.findById(userFound?.id as string);
        expect(result).toBeDefined();
        expect(result?.id).toBeDefined();
        expect(result?.name).toBe(user.name);
        expect(result?.email).toBe(user.email);
    });

    it("should reject when id is not found", async () => {
        await expect(authService.findById("wrong-id")).resolves.toBeNull()
    });
    
    it("should reject when email already exists", async () => {
        await expect(authService.signup(user)).rejects.toThrow("Email já cadastrado");
    });

    it("should signin a user", async () => {
        const result = await authService.signin(user.email, user.password);
        expect(result).toBeDefined();
        expect(result.token).toBeDefined();
        expect(result.user).toBeDefined();
        expect(result.user.id).toBeDefined();
        expect(result.user.name).toBe(user.name);
        expect(result.user.email).toBe(user.email);
    });

    it("should reject when email is invalid", async () => {
        await expect(authService.signin("wrong-email", user.password)).rejects.toThrow("Email não encontrado");
    });

    it("should reject when password is invalid", async () => {
        await expect(authService.signin(user.email, "wrong-password")).rejects.toThrow("Senha incorreta");
    });

    it("should verify a user", async () => {
        const userFound = await authService.findByEmail(user.email);
        const result = await authService.verify(userFound?.id as string);
        expect(result).toBe(true);
    });

    it("should reject when user is not found", async () => {
        await expect(authService.verify("wrong-id")).rejects.toThrow("Acesso Negado");
    });
});
