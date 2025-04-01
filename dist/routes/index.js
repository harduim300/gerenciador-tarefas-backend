"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_routes_1 = __importDefault(require("./users.routes"));
const tasks_routes_1 = __importDefault(require("./tasks.routes"));
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const jwt_1 = require("../libs/jwt");
const router = (0, express_1.Router)();
router.use("/tasks", jwt_1.verifyJWT, tasks_routes_1.default);
router.use("/usuario", jwt_1.verifyJWT, users_routes_1.default);
router.use("/auth", auth_routes_1.default);
exports.default = router;
