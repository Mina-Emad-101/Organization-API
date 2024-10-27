import type { JwtPayload } from "jsonwebtoken";

export interface JWTBody extends JwtPayload {
  id: string;
}

export interface RefreshJWTBody extends JWTBody {
  user_id: string;
}
