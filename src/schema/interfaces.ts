export interface AddressInput {
  cep: string;
  street: string;
  streetNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface AddressOutput {
  id: number;
  cep: string;
  street: string;
  streetNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface CreateUserInput {
  userData: UserInput;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
  birthDate: string;
  addresses: AddressInput[];
}

export interface UserOutput {
  name: string;
  email: string;
  id: number;
  birthDate: string;
  addresses: AddressOutput[];
}

export interface UserList {
  users: UserOutput[];
  total: number;
  usersBefore: boolean;
  usersAfter: boolean;
  maxPage: number;
}

export interface LoginUserInput {
  loginData: LoginInput;
  rememberMe: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: UserOutput;
  token: string;
}

export interface JWTPayload {
  userID: number;
  iat: number;
  exp: number;
}
