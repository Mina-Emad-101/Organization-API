import type { Schema } from "express-validator";
import { User } from "../dbSchemas/user.js";

export const signupSchema: Schema = {
	name: {
		notEmpty: { errorMessage: "Name Cannot Be Empty" },
		isAlphanumeric: { errorMessage: "Name Must Only Contain (a-z/A-Z/0-9)" },
	},
	email: {
		notEmpty: { errorMessage: "Email Cannot Be Empty" },
		isEmail: { errorMessage: "Invalid Email, Email Format: test@email.com" },
		custom: {
			options: async (email) => {
				const user = await User.findOne({ email: email });
				if (user) {
					throw new Error("E-mail already in use");
				}
			},
		},
	},
	password: {
		notEmpty: { errorMessage: "Password Cannot Be Empty" },
		isStrongPassword: { errorMessage: "Weak Password" },
	},
};

export const signinSchema: Schema = {
	email: {
		notEmpty: { errorMessage: "Email Cannot Be Empty" },
		isEmail: { errorMessage: "Invalid Email, Email Format: test@email.com" },
	},
	password: {
		notEmpty: { errorMessage: "Password Cannot Be Empty" },
	},
};

export const refreshSchema: Schema = {
	refresh_token: {
		notEmpty: { errorMessage: "refresh_token Cannot Be Empty" },
	},
};
