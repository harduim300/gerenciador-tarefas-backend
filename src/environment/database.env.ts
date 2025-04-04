import dotenv from "dotenv";

dotenv.config();

let DATABASE_URL = process.env.DATABASE_URL;

if (process.env.NODE_ENV === "test") {
    DATABASE_URL = process.env.DATABASE_URL_TEST;
}

export default DATABASE_URL;
