import { Response } from "express";

export const dealWithError = (response: Response, error: any) => {
    console.log(error)
    if(error.code && error.message){
        response.status(error.code).send({error: error.message})
        return;
    }
    response.status(500).send({error: "Erro inesperado."})
    return;
}