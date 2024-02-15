import mongoose from 'mongoose';
import userRouter from './src/routes/user';
import dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import ScanningRouter from "./src/routes/scanning";
import { connectToMongoDB } from "./src/db/mongo";
import authRouter from "./src/routes/auth";

dotenv.config();
const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;
const app: Express = express();

app.use(cors());
app.use(express.json()); // pars request to JSON
app.use(express.urlencoded({ extended: true })); // pars encoded request to JSON

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/scanning", ScanningRouter);

app.use((err, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message });
});

const startServer = async () => {
    await connectToMongoDB();   
    app.listen(PORT, () => {
        console.log(`Server is listening on port: ${PORT}`)
    })
}

startServer();