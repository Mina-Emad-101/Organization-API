import express, {} from "express";
import mongoose, { Error } from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.js";
import organizationsRouter from "./routes/organizations.js";
const HOST = process.env.HOST;
const PORT = parseInt(process.env.PORT);
const NODE_ENV = process.env.NODE_ENV;
const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
mongoose
    .connect(NODE_ENV === "development"
    ? "mongodb://localhost:27017/organization"
    : `mongodb+srv://mina:${process.env.DBPASSWORD}@cluster0.yjr3f.mongodb.net/organization?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log("Connected To DB"), (err) => console.log(`DB Error: ${err}`));
// Routes
app.use("/api/v1", authRouter);
app.use("/api/v1", organizationsRouter);
app.listen(PORT, HOST, () => {
    console.log(`Listening on ${HOST}:${PORT}`);
});
