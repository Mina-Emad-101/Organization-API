import type { Request, Response } from "express-serve-static-core";
import { validationResult } from "express-validator";
import { Organization } from "../dbSchemas/organization.js";
import { resourcifyOrg } from "../utils/resourcify.js";
import { User } from "../dbSchemas/user.js";
import type {
  ICreateOrganization,
  IInviteUserToOrganization,
  IUpdateOrganizationByID,
} from "../types/handlers/organizations.js";

export async function createOrganization(
  req: Request<{}, {}, ICreateOrganization>,
  res: Response,
) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res
      .status(400)
      .json({ message: "Validation Errors", errors: result.array() });
    return;
  }

  const { name, description } = req.body;

  const org = new Organization({
    owner_id: req.user.id,
    name: name,
    description: description,
  });

  await org.save();
  res.json({ organization_id: org.id });
  return;
}

export async function updateOrganizationByID(
  req: Request<{}, {}, IUpdateOrganizationByID>,
  res: Response,
) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res
      .status(400)
      .json({ message: "Validation Errors", errors: result.array() });
    return;
  }

  const { name, description } = req.body;

  req.org.name = name;
  req.org.description = description;

  await req.org.save();
  res.json({ message: "Success" });
  return;
}

export async function deleteOrganizationByID(req: Request, res: Response) {
  await req.org.deleteOne();
  res.json({ message: "Success" });
  return;
}

export async function getOrganizationByID(req: Request, res: Response) {
  const org_resource = await resourcifyOrg(req.org);
  res.json(org_resource);
  return;
}

export async function getOrganizations(req: Request, res: Response) {
  const orgs = (await Organization.find()).filter((org) => {
    const is_owner: boolean = req.user.id === org.owner_id.toString();

    let is_member: boolean = false;
    org.organization_members.map((member: any) => {
      if (req.user.id === member.member_id.toString()) is_member = true;
    });

    if (!is_owner && !is_member) return false;
    return true;
  });

  const orgs_resources = await Promise.all(
    orgs.map(async (org) => await resourcifyOrg(org)),
  );

  res.json(orgs_resources);
  return;
}

export async function inviteUserToOrganization(
  req: Request<{}, {}, IInviteUserToOrganization>,
  res: Response,
) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res
      .status(400)
      .json({ message: "Validation Errors", errors: result.array() });
    return;
  }

  const email: string = req.body.user_email;
  const user: any = await User.findOne({ email: email });

  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return;
  }

  req.org.organization_members.map((member: any) => {
    if (user.id === member.member_id) {
      res.status(403).json({ message: "Already a Member" });
      return;
    }
  });

  const member = {
    member_id: user.id,
    access_level: "A",
  };

  req.org.organization_members.push(member);

  await req.org.save();
  res.json({ message: "Success" });
  return;
}
