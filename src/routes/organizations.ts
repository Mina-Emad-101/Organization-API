import { Router } from "express";
import { verifyJWT } from "../utils/middlewares/auth.js";
import {
  getOrganizationMW,
  is_owner,
  is_owner_or_member,
} from "../utils/middlewares/organizations.js";
import { checkSchema } from "express-validator";
import {
  createSchema,
  inviteSchema,
  putSchema,
} from "../validationSchemas/organization.js";
import {
  createOrganization,
  deleteOrganizationByID,
  getOrganizationByID,
  getOrganizations,
  inviteUserToOrganization,
  updateOrganizationByID,
} from "../handlers/organizations.js";

const router: Router = Router();

router.post(
  "/organization",
  verifyJWT,
  checkSchema(createSchema),
  createOrganization,
);

router.put(
  "/organization/:id",
  verifyJWT,
  getOrganizationMW,
  is_owner,
  checkSchema(putSchema),
  updateOrganizationByID,
);

router.delete(
  "/organization/:id",
  verifyJWT,
  getOrganizationMW,
  is_owner,
  deleteOrganizationByID,
);

router.get(
  "/organization/:id",
  verifyJWT,
  getOrganizationMW,
  is_owner_or_member,
  getOrganizationByID,
);

router.get("/organization", verifyJWT, getOrganizations);

router.post(
  "/organization/:id/invite",
  verifyJWT,
  getOrganizationMW,
  is_owner,
  checkSchema(inviteSchema),
  inviteUserToOrganization,
);

export default router;
