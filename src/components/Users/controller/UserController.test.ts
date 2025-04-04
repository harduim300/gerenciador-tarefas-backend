import { UserController } from "./UsersController";

describe("UserController", () => {
    let userController: UserController;

    beforeEach(() => {
        userController = new UserController();
    });
    it("should create a new user", () => {
        const user = {
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password"
        };
    });
});
