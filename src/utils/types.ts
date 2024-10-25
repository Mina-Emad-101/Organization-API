import type { Request } from "express";

export type JWTBody = {
	id: number;
};

export interface ExtendedRequest extends Request {
	user?: any;
	org?: any;
}
