import type { Request } from "express";

export type JWTBody = {
	id: string;
};

export interface ExtendedRequest extends Request {
	user?: any;
	org?: any;
}
