import * as express from "express-serve-static-core";
import { User } from "./dbSchemas/user.js";
import { Organization } from "./dbSchemas/organization.js";

declare global {
  namespace Express {
    interface Request {
      user?: typeof User;
      org?: typeof Organization;
    }
  }
}
