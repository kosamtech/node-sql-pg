import app from "./app";
import pool from "./pool";
import * as dotenv from "dotenv";

dotenv.config();

pool.connect({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
})
    .then(() => {
        app().listen(3005, () => {
            console.log("Listening on port 3005");
        });
    })
    .catch((err) => console.log("error while connecting", err));
