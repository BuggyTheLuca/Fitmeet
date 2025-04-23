import { Request, Response } from "express";
import { deactivateLoggedUser, defineUserPreferences, getUserDetails, getUserPreferences, setUserAvatar, updateUser } from "../services/user-service";
import { dealWithError } from "../utils/error-utils";
import { UpdateUserRequest } from "../types/user-types";

export const getLoggedUser = async (request: Request, response: Response) => {
    try {
        const user = await getUserDetails(request.loggedUser.email!)
        response.status(200).send(user);
        return;
    } catch (error: any) {
        dealWithError(response, error);
    }
}

export const update = async (request: Request, response: Response) => {
    try {
        const updateUserRequest: UpdateUserRequest = request.body
        const userId = request.loggedUser.id;
        const responseUser = await updateUser(userId, updateUserRequest)
        response.status(200).send(responseUser)
    } catch (error: any) {
        dealWithError(response, error);
    }
}

export const deactivate = async (request: Request, response: Response) => {
    try {
        const userId = request.loggedUser.id
        await deactivateLoggedUser(userId);
        response.status(200).send({message: "Conta desativada com sucesso."})
    } catch (error: any) {
        dealWithError(response, error)
    }
}

export const getPreferences = async (request: Request, response: Response) => {
    try {
        const userId = request.loggedUser.id;
        const preferences = await getUserPreferences(userId)
        response.status(200).send(preferences)
    } catch (error: any) {
        dealWithError(response, error)
    }
}

export const updatePreferences = async (request: Request, response: Response) => {
    try {
        const userId = request.loggedUser.id;
        const typeIds = request.body;

        await defineUserPreferences(userId, typeIds)

        response.status(200).send({message: 'Preferências atualizadas com sucesso.'})
    } catch (error: any) {
        dealWithError(response, error)
    }
}

export const updateAvatar = async (request: Request, response: Response) => {
    try {
        if(!request.file){
            response.status(400).send({error: "Informe os campos obrigatórios corretamente."});
            return;
        }
        const userId = request.loggedUser.id;
        const file = request.file;
        const fileUrl = await setUserAvatar(userId, file)
        
        response.status(200).send({avatar: fileUrl})
    } catch (error: any) {
        dealWithError(response, error)
    }
}

