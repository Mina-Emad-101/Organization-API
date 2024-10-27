import type { Request, Response } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { User } from "../../dbSchemas/user.js";

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: () => void | PromiseLike<void>,
) => {
  const auth_header: string | undefined = req.headers["authorization"];

  let token: string;

  if (auth_header) {
    token = auth_header.split(" ")[1];
  } else {
    res.status(400).json({ message: "Authorization Token Missing" });
    return;
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    {},
    async (err: any, body: any) => {
      if (err) return res.status(401).json({ message: "Invalid Access Token" });

      const user = await User.findById(body.id);
      req.user = user;
      return next();
    },
  );
};
