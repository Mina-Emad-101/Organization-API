import { checkSchema } from "express-validator";
import {
  refreshSchema,
  signinSchema,
  signupSchema,
} from "../validationSchemas/auth.js";
import { verifyJWT } from "../utils/middlewares/auth.js";
import { Router } from "express";
import {
  refreshToken,
  revokeRefreshToken,
  signin,
  signup,
} from "../handlers/auth.js";

const router: Router = Router();

router.post("/signup", checkSchema(signupSchema), signup);

router.post("/signin", checkSchema(signinSchema), signin);

router.post("/refresh-token", checkSchema(refreshSchema), refreshToken);

router.post("/revoke-refresh-token", verifyJWT, revokeRefreshToken);

export default router;
