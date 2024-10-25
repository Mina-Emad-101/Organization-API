import { User } from "../dbSchemas/user.js";

export const resourcifyOrg = async (org: any) => {
	const org_resource = {
		organization_id: org.id,
		name: org.name,
		description: org.description,
		organization_members: await Promise.all(
			org.organization_members.map(async (member: any) => {
				const user = await User.findById(member.member_id);

				return {
					name: user.name,
					email: user.email,
					access_level: member.access_level,
				};
			}),
		),
	};

	return org_resource;
};
