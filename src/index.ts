import express, { type Express } from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import organizationsRouter from "./routes/organizations.js";

const HOST: string = process.env.HOST as string;
const PORT: number = parseInt(process.env.PORT as string);

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", authRouter);
app.use("/api/v1", organizationsRouter);

app.listen(PORT, HOST, () => {
	console.log(`Listening on ${HOST}:${PORT}`);
});
