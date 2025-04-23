import { NextFunction, Request, Response } from "express";
import { isUserDeleted } from "../services/user-service";

export const validateAccountDeleted = async (request: Request, response: Response, next: NextFunction) => {
    if(!request.loggedUser){
        response.status(500).send({error: "Erro inesperado."})
        return;
    }
    const userId = request.loggedUser.id;

    const isAccountDeleted = await isUserDeleted(userId)

    if(isAccountDeleted){
        response.status(403).send({error: "Esta conta foi desativada e não pode ser utilizada."})
        return;
    }

    next();
}