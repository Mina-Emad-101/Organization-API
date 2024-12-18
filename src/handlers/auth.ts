import type { Request, Response } from "express-serve-static-core";
import { validationResult } from "express-validator";
import { User } from "../dbSchemas/user.js";
import jwt from "jsonwebtoken";
import { redis } from "../data-sources.js";
import type {
	IRefreshToken,
	ISignin,
	ISignup,
} from "../types/handlers/auth.js";

export async function signup(req: Request<{}, {}, ISignup>, res: Response) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res
			.status(400)
			.json({ message: "Validation Errors", errors: result.array() });
	}

	const { name, email, password } = req.body;

	const user = new User({
		name: name,
		email: email,
		password: password,
	});

	await user.save();

	return res.json({ message: "Success" });
}

export async function signin(req: Request<{}, {}, ISignin>, res: Response) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res
			.status(400)
			.json({ message: "Validation Errors", errors: result.array() });
	}

	const { email, password } = req.body;

	const user = await User.findOne({ email: email });
	if (!user) {
		return res.status(404).json({ message: "Email Doesn't Exist" });
	}

	if (user.password !== password) {
		return res.status(401).json({ message: "Password Incorrect" });
	}

	const access_token = jwt.sign(
		{ id: user.id },
		process.env.ACCESS_TOKEN_SECRET as string,
		{ expiresIn: process.env.ACCESS_TOKEN_EXPIRATION as string },
	);

	const tokenID = Math.random().toString(36).slice(2);
	const refresh_token = jwt.sign(
		{ id: tokenID, user_id: user.id },
		process.env.REFRESH_TOKEN_SECRET as string,
	);

	await redis.setEx(
		`${user.id}:${tokenID}`,
		parseInt(process.env.REFRESH_TOKEN_EXPIRATION as string),
		refresh_token,
	);

	return res.json({
		message: "Success",
		access_token: access_token,
		refresh_token: refresh_token,
	});
}

export async function refreshToken(
	req: Request<{}, {}, IRefreshToken>,
	res: Response,
) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res
			.status(400)
			.json({ message: "Validation Errors", errors: result.array() });
	}

	const { refresh_token } = req.body;

	jwt.verify(
		refresh_token,
		process.env.REFRESH_TOKEN_SECRET as string,
		{},
		async (err: any, token: any) => {
			if (err) {
				return res.status(400).json({ message: "Invalid Refresh Token" });
			}

			console.log(token);

			const token_exists: boolean =
				(await redis.exists(`${token.user_id}:${token.id}`)) === 1;

			if (!token_exists) {
				return res.status(400).json({ message: "Expired Refresh Token" });
			}

			const access_token = jwt.sign(
				{ id: token.user_id },
				process.env.ACCESS_TOKEN_SECRET as string,
				{ expiresIn: process.env.ACCESS_TOKEN_EXPIRATION as string },
			);

			const tokenID = Math.random().toString(36).slice(2);
			const refresh_token = jwt.sign(
				{ id: tokenID, user_id: token.user_id },
				process.env.REFRESH_TOKEN_SECRET as string,
			);

			await redis.del(`${token.user_id}:${token.id}`);

			await redis.setEx(
				`${token.user_id}:${tokenID}` as string,
				parseInt(process.env.REFRESH_TOKEN_EXPIRATION as string),
				refresh_token,
			);

			return res.json({
				message: "Success",
				access_token: access_token,
				refresh_token: refresh_token,
			});
		},
	);
}

export async function revokeRefreshToken(req: Request, res: Response) {
	const keys = await redis.keys(`${req.user.id}:*`);
	await redis.del(keys);

	return res.json({ message: "Success" });
}
