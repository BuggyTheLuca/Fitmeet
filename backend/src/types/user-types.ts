export type NewUserRequest = {
    name: string,
    email: string,
    cpf: string,
    password: string
}

export type UpdateUserRequest = {
    email?: string;
    password?: string;
    name?: string;
};
