import mongoose from "mongoose";
import Redis from "redis";

mongoose.connect(`${process.env.MONGODB_URI}`).then(
	() => console.log("Connected To DB"),
	(err: Error) => console.log(`DB Error: ${err}`),
);

export const redis = Redis.createClient({ url: process.env.REDIS_URI });
await redis.connect();
