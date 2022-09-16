export interface CreateUserInput {
  userData: UserInput;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface UserOutput {
  name: string;
  email: string;
  id: number;
  birthDate: string;
}

export interface UserList {
  users: [UserOutput];
  userNum: number;
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
