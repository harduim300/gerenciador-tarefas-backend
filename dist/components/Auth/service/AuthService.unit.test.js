"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = require("./AuthService");
const prisma_1 = require("../../../libs/prisma");
const argon2_1 = __importDefault(require("argon2"));
describe("AuthService", () => {
    let authService;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        authService = new AuthService_1.AuthService();
        yield prisma_1.prisma.task.deleteMany();
        yield prisma_1.prisma.user.deleteMany();
    }));
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password"
    };
    it("should create a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield authService.signup(user);
        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.name).toBe(user.name);
        expect(result.email).toBe(user.email);
        const verifyPassword = yield argon2_1.default.verify(result.password, user.password);
        expect(verifyPassword).toBe(true);
    }));
});
