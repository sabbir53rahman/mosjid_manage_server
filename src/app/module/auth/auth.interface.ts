export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
  phone: number;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
