import { Request, Response } from "express";
import { NewUserRequest } from "../types/user-types";

import jwt from "jsonwebtoken";
import { createUser } from "../services/user-service";
import LoginRequest from "../types/login-request";
import { login } from "../services/auth-service";
import { dealWithError } from "../utils/error-utils";

const jwtSecret = process.env.JWT_SECRET!;

export const register = async (request: Request, response: Response) => {
    try {
        const newUserRequest: NewUserRequest = request.body;
        await createUser(newUserRequest);
        
        response.status(201).send({message: "Usuário criado com sucesso."})
        return;
    } catch (error: any) {
        dealWithError(response, error);
    }
}

export const signIn = async (request: Request, response: Response) => {
    try {
        const loginRequest: LoginRequest = request.body;
        const user = await login(loginRequest)

        const token = jwt.sign(user, jwtSecret, {expiresIn: '3h'})

        response.status(200).send({...user, token})
        return;
    } catch (error: any) {
        dealWithError(response, error);
    }
}