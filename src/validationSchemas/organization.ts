import type { Schema } from "express-validator";

export const createSchema: Schema = {
	name: {
		notEmpty: { errorMessage: "Name Cannot Be Empty" },
		isAlphanumeric: { errorMessage: "Name Must Only Contain (a-z/A-Z/0-9)" },
	},
	description: {
		notEmpty: { errorMessage: "Description Cannot Be Empty" },
	},
};

export const putSchema: Schema = {
	name: {
		notEmpty: { errorMessage: "Name Cannot Be Empty" },
		isAlphanumeric: { errorMessage: "Name Must Only Contain (a-z/A-Z/0-9)" },
	},
	description: {
		notEmpty: { errorMessage: "Description Cannot Be Empty" },
	},
};

export const inviteSchema: Schema = {
	user_email: {
		notEmpty: { errorMessage: "Email Cannot Be Empty" },
		isEmail: { errorMessage: "Invalid Email, Email Format: test@email.com" },
	},
};
