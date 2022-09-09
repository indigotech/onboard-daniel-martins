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
