import jwt from "jsonwebtoken";
import type { ExtendedRequest, JWTBody } from "./types.js";
import { User } from "../dbSchemas/user.js";

export const verifyJWT = async (
	req: ExtendedRequest,
	res: any,
	next: () => void | PromiseLike<void>,
) => {
	const auth_header: string = req.headers["authorization"];

	let token: string;
	try {
		token = auth_header.split(" ")[1];
	} catch (err) {
		return res.status(400).json({ message: "Authorization Token Missing" });
	}

	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET,
		{},
		async (err, body: JWTBody) => {
			if (err) return res.status(401).json({ message: "Invalid Access Token" });

			const user = await User.findById(body.id);
			req.user = user;
			return next();
		},
	);
};
