"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UsersService_1 = require("./UsersService");
describe("UserService", () => {
    let userService;
    beforeEach(() => {
        userService = new UsersService_1.UserService();
    });
    it("should create a new user", () => {
        const user = {
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password"
        };
    });
});
