import express, { type Express } from "express";
import mongoose, { Error } from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.js";
import organizationsRouter from "./routes/organizations.js";

const HOST: string = process.env.HOST as string;
const PORT: number = parseInt(process.env.PORT as string);
const NODE_ENV: string = process.env.NODE_ENV as string;

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());

mongoose
	.connect(
		NODE_ENV === "development"
			? "mongodb://localhost:27017/organization"
			: `mongodb+srv://mina:${process.env.DBPASSWORD}@cluster0.yjr3f.mongodb.net/organization?retryWrites=true&w=majority&appName=Cluster0`,
	)
	.then(
		() => console.log("Connected To DB"),
		(err: Error) => console.log(`DB Error: ${err}`),
	);

// Routes
app.use("/api/v1", authRouter);
app.use("/api/v1", organizationsRouter);

app.listen(PORT, HOST, () => {
	console.log(`Listening on ${HOST}:${PORT}`);
});
