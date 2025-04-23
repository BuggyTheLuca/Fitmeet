export interface UserResponse {
    token: string;
    id: string;
    name: string;
    email: string;
    cpf: string;
    avatar: string;
    xp: number;
    level: number;
    achievements: Achievement[];
}

export interface Achievement{
    name: string,
    criterion: string 
}

export interface UserLoginRequest{
    email: string;
    password: string;
}

export interface NewUserRequest{
    name: string,
    email: string,
    cpf: string,
    password: string
}

export interface LoggedUser{
    id: string,
    email: string,
    name: string,
    token: string,
    avatar: string,
    level: number
}

export interface Preference{
    typeId: string,
    typeName: string,
    typeDescription: string
}

export interface Participant {
    id: string,
    userId: string,
    name: string,
    avatar?: string,
    subscriptionStatus: string,
    confirmedAt: string
  }