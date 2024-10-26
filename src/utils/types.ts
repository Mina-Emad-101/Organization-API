import type { Request } from "express";

export interface JWTBody {
	id: string;
}

export interface RefreshJWTBody extends JWTBody {
	user_id: string;
}

export interface ExtendedRequest extends Request {
	user?: any;
	org?: any;
}
