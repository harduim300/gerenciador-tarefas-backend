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
exports.verifyJWT = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJWT = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
exports.createJWT = createJWT;
const verifyJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.cookies['authToken'];
    if (!authHeader) {
        res.status(401).json({ error: "Acesso negado" });
        return;
    }
    const token = authHeader;
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(500).json({ error: "Acesso negado" });
            return;
        }
        req.userId = decoded.id;
        next();
    });
});
exports.verifyJWT = verifyJWT;
