export interface ISignup {
  name: string;
  email: string;
  password: string;
}

export interface ISignin {
  email: string;
  password: string;
}

export interface IRefreshToken {
  refresh_token: string;
}
