import { Router } from "express";
import { Organization } from "../dbSchemas/organization.js";
import { verifyJWT } from "../utils/auth.js";
import type { ExtendedRequest } from "../utils/types.js";
import { resourcifyOrg } from "../utils/resourcify.js";
import { User } from "../dbSchemas/user.js";
import {
	getOrganization,
	is_owner,
	is_owner_or_member,
} from "../utils/organizations.js";
import { checkSchema, validationResult } from "express-validator";
import {
	createSchema,
	inviteSchema,
	putSchema,
} from "../validationSchemas/organization.js";

const router: Router = Router();

router.post(
	"/organization",
	verifyJWT,
	checkSchema(createSchema),
	async (req: ExtendedRequest, res: any) => {
		const result = validationResult(req);
		if (!result.isEmpty())
			return res
				.status(400)
				.json({ message: "Validation Errors", errors: result.array() });

		const { name, description } = req.body;

		const org = new Organization({
			owner_id: req.user.id,
			name: name,
			description: description,
		});

		await org.save();
		return res.json({ organization_id: org.id });
	},
);

router.put(
	"/organization/:id",
	verifyJWT,
	getOrganization,
	is_owner,
	checkSchema(putSchema),
	async (req: ExtendedRequest, res: any) => {
		const result = validationResult(req);
		if (!result.isEmpty())
			return res
				.status(400)
				.json({ message: "Validation Errors", errors: result.array() });

		const { name, description } = req.body;

		req.org.name = name;
		req.org.description = description;

		await req.org.save();
		return res.json({ message: "Success" });
	},
);

router.delete(
	"/organization/:id",
	verifyJWT,
	getOrganization,
	is_owner,
	async (req: ExtendedRequest, res: any) => {
		await req.org.deleteOne();
		return res.json({ message: "Success" });
	},
);

router.get(
	"/organization/:id",
	verifyJWT,
	getOrganization,
	is_owner_or_member,
	async (req: ExtendedRequest, res: any) => {
		const org_resource = await resourcifyOrg(req.org);
		return res.json(org_resource);
	},
);

router.get(
	"/organization",
	verifyJWT,
	async (req: ExtendedRequest, res: any) => {
		const orgs = (await Organization.find()).filter((org) => {
			const is_owner: boolean = req.user.id === org.owner_id.toString();

			let is_member: boolean;
			org.organization_members.map((member: any) => {
				if (req.user.id === member.member_id.toString()) is_member = true;
			});

			if (!is_owner && !is_member) return false;
			return true;
		});

		const orgs_resources = await Promise.all(
			orgs.map(async (org) => await resourcifyOrg(org)),
		);

		return res.json(orgs_resources);
	},
);

router.post(
	"/organization/:id/invite",
	verifyJWT,
	getOrganization,
	is_owner,
	checkSchema(inviteSchema),
	async (req: ExtendedRequest, res: any) => {
		const result = validationResult(req);
		if (!result.isEmpty())
			return res
				.status(400)
				.json({ message: "Validation Errors", errors: result.array() });

		const email: string = req.body.user_email;
		const user: any = await User.findOne({ email: email });

		if (!user) return res.status(404).json({ message: "User Not Found" });

		req.org.organization_members.map((member: any) => {
			if (user.id === member.member_id)
				return res.status(403).json({ message: "Already a Member" });
		});

		const member = {
			member_id: user.id,
			access_level: "A",
		};

		req.org.organization_members.push(member);

		await req.org.save();
		return res.json({ message: "Success" });
	},
);

export default router;
