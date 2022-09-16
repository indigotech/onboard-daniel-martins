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

export interface LoginUserInput {
  loginData: LoginInput;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: UserOutput;
  token: string;
}
