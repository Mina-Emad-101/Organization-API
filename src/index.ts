import express, { type Express } from "express";
import mongoose, { Error } from "mongoose";
import Redis from "redis";
import cors from "cors";
import authRouter from "./routes/auth.js";
import organizationsRouter from "./routes/organizations.js";

const HOST: string = process.env.HOST as string;
const PORT: number = parseInt(process.env.PORT as string);

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());

// DB Connections
mongoose.connect(`${process.env.MONGODB_URI}`).then(
	() => console.log("Connected To DB"),
	(err: Error) => console.log(`DB Error: ${err}`),
);

export const redis = Redis.createClient({ url: process.env.REDIS_URI });
await redis.connect();

// Routes
app.use("/api/v1", authRouter);
app.use("/api/v1", organizationsRouter);

app.listen(PORT, HOST, () => {
	console.log(`Listening on ${HOST}:${PORT}`);
});
