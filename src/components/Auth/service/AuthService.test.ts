import { AuthService } from "./AuthService";

describe("AuthService", () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService();
    });

    it("should create a new user", () => {
        const user = {
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password"
        };
    });
});
