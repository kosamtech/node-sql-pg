import express from "express";
import userRouter from "./routes/user";

const app = () => {
    const app = express();

    app.use(express.json());
    app.use(userRouter);

    return app;
};

export default app;
