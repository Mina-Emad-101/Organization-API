import { Schema, model } from "mongoose";

const OrganizationMemberSchema = new Schema({
	member_id: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	access_level: {
		type: Schema.Types.String,
		required: true,
	},
});

const OrganizationSchema = new Schema({
	owner_id: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	name: {
		type: Schema.Types.String,
		required: true,
	},
	description: {
		type: Schema.Types.String,
		required: true,
	},
	organization_members: {
		type: [OrganizationMemberSchema],
		default: [],
	},
});

export const Organization = model("Organization", OrganizationSchema);
