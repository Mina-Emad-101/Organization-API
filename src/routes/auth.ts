import { User } from "../dbSchemas/user.js";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../dbSchemas/refresh.js";
import { type Request, Router } from "express";
import type { JWTBody } from "../utils/types.js";
import { checkSchema, validationResult } from "express-validator";
import {
	refreshSchema,
	signinSchema,
	signupSchema,
} from "../validationSchemas/auth.js";

const router: Router = Router();

router.post(
	"/signup",
	checkSchema(signupSchema),
	async (req: Request, res: any) => {
		const result = validationResult(req);
		if (!result.isEmpty())
			return res
				.status(400)
				.json({ message: "Validation Errors", errors: result.array() });

		const { name, email, password } = req.body;

		const user = new User({
			name: name,
			email: email,
			password: password,
		});

		await user.save();

		return res.json({ message: "Success" });
	},
);

router.post(
	"/signin",
	checkSchema(signinSchema),
	async (req: Request, res: any) => {
		const result = validationResult(req);
		if (!result.isEmpty())
			return res
				.status(400)
				.json({ message: "Validation Errors", errors: result.array() });

		const { email, password } = req.body;

		const user = await User.findOne({ email: email });
		if (!user) return res.status(404).json({ message: "Email Doesn't Exist" });

		if (user.password !== password)
			return res.status(401).json({ message: "Password Incorrect" });

		const access_token = jwt.sign(
			{ id: user.id },
			process.env.ACCESS_TOKEN_SECRET as string,
			{ expiresIn: process.env.ACCESS_TOKEN_EXPIRATION as string },
		);

		const refresh_token = new RefreshToken({
			token: jwt.sign(
				{ id: user.id },
				process.env.REFRESH_TOKEN_SECRET as string,
			),
		});

		await refresh_token.save();

		return res.json({
			message: "Success",
			access_token: access_token,
			refresh_token: refresh_token.token,
		});
	},
);

router.post(
	"/refresh-token",
	checkSchema(refreshSchema),
	async (req: Request, res: any) => {
		const result = validationResult(req);
		if (!result.isEmpty())
			return res
				.status(400)
				.json({ message: "Validation Errors", errors: result.array() });

		const { refresh_token } = req.body;

		await RefreshToken.findOne({ token: refresh_token }).then(
			(tokenObject) => {
				if (!tokenObject)
					return res.status(404).json({ message: "Token Not Found" });

				jwt.verify(
					refresh_token,
					process.env.REFRESH_TOKEN_SECRET as string,
					{},
					(_, user: JWTBody) => {
						const access_token = jwt.sign(
							{ id: user.id },
							process.env.ACCESS_TOKEN_SECRET as string,
							{ expiresIn: process.env.ACCESS_TOKEN_EXPIRATION as string },
						);

						return res.json({
							message: "Success",
							access_token: access_token,
							refresh_token: refresh_token,
						});
					},
				);
			},
			(_) => res.status(500).json({ message: "Internal Server Error" }),
		);
	},
);

export default router;
