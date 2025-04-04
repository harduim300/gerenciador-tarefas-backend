import dotenv from "dotenv";

dotenv.config();

let JWT_SECRET = process.env.JWT_SECRET;

if (process.env.NODE_ENV === "test") {
    JWT_SECRET = process.env.JWT_SECRET_TEST;
}

export default JWT_SECRET;
