"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let JWT_SECRET = process.env.JWT_SECRET;
if (process.env.NODE_ENV === "test") {
    JWT_SECRET = process.env.JWT_SECRET_TEST;
}
exports.default = JWT_SECRET;
