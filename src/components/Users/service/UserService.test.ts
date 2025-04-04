import { UserService } from "./UsersService";

describe("UserService", () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
    });

    it("should create a new user", () => {
        const user = {
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password"    
        };
    });
});
