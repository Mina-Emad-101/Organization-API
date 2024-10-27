import type { Request, Response } from "express-serve-static-core";
import { Organization } from "../../dbSchemas/organization.js";

export const getOrganizationMW = async (
  req: Request,
  res: Response,
  next: () => any,
) => {
  const id: string = req.params.id;
  const org = await Organization.findById(id).catch((_) =>
    res.status(400).json({ message: "Invalid ID" }),
  );
  if (!org) return res.status(404).json({ message: "Organization Not Found" });
  req.org = org;
  return next();
};

export const is_owner = (req: Request, res: any, next: () => any) => {
  const is_owner: boolean = req.user.id === req.org.owner_id.toString();
  if (!is_owner)
    return res
      .status(403)
      .json({ message: "You are not Owner of Organization" });
  return next();
};

export const is_member = (req: Request, res: any, next: () => any) => {
  req.org.organization_members.map((member: any) => {
    if (req.user.id === member.member_id.toString()) return next();
  });
  return res
    .status(403)
    .json({ message: "You are not Member of Organization" });
};

export const is_owner_or_member = (req: Request, res: any, next: () => any) => {
  const is_owner: boolean = req.user.id === req.org.owner_id.toString();

  let is_member: boolean = false;
  req.org.organization_members.map((member: any) => {
    if (req.user.id === member.member_id.toString()) is_member = true;
  });

  if (!is_owner && !is_member)
    return res.status(403).json({
      message: "You are neither Owner nor Member of this Organization",
    });

  return next();
};
