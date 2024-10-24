import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const HOST: string = process.env.HOST || "127.0.0.1";
const PORT: number = parseInt(process.env.PORT) || 8000;
const NODE_ENV: string = process.env.NODE_ENV || "development";

const app = express();

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
    (err) => console.log(`DB Error: ${err}`),
  );

app.listen(PORT, HOST, () => {
  console.log(`Listening on ${HOST}:${PORT}`);
});
