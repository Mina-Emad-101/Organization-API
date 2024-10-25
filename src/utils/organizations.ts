import { Organization } from "../dbSchemas/organization.js";
import type { ExtendedRequest } from "./types.js";

export const getOrganization = async (
	req: ExtendedRequest,
	res: any,
	next: () => any,
) => {
	const id: string = req.params.id;
	const org = await Organization.findById(id);
	if (!org) return res.status(404).json({ message: "Organization Not Found" });
	req.org = org;
	return next();
};

export const is_owner = (req: ExtendedRequest, res: any, next: () => any) => {
	const is_owner: boolean = req.user.id === req.org.owner_id.toString();
	if (!is_owner)
		return res
			.status(403)
			.json({ message: "You are not Owner of Organization" });
	return next();
};

export const is_member = (req: ExtendedRequest, res: any, next: () => any) => {
	req.org.organization_members.map((member: any) => {
		if (req.user.id === member.member_id.toString()) return next();
	});
	return res
		.status(403)
		.json({ message: "You are not Member of Organization" });
};

export const is_owner_or_member = (
	req: ExtendedRequest,
	res: any,
	next: () => any,
) => {
	const is_owner: boolean = req.user.id === req.org.owner_id.toString();

	let is_member: boolean;
	req.org.organization_members.map((member: any) => {
		if (req.user.id === member.member_id.toString()) is_member = true;
	});

	if (!is_owner && !is_member)
		return res.status(403).json({
			message: "You are neither Owner nor Member of this Organization",
		});

	return next();
};
