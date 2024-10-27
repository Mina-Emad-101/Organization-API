export interface ICreateOrganization {
  name: string;
  description: string;
}

export interface IUpdateOrganizationByID {
  name: string;
  description: string;
}

export interface IInviteUserToOrganization {
  user_email: string;
}
