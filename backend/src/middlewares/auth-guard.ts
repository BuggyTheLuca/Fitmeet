import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET!;

export default function authGuard(request: Request, response: Response, next: NextFunction){
    const authHeader = request.headers.authorization

    if(!authHeader){
        response.status(401).send({error: "Autenticação necessária."})
        return;
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const user = jwt.verify(token, jwtSecret) as {
            id: string;
            name: string;
            email: string;
          };

        request.loggedUser = {
            id: user.id,
            name: user.name,
            email: user.email
        }
        
        next();
    } catch (error) {
        console.log(error)
        response.status(401).send({error: "Token inválido."})
        return;
    }
}