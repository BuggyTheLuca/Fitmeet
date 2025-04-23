import { Request, Response, NextFunction } from "express";

export default function validateFile(request: Request, response: Response, next: NextFunction) {
    if(request.file){
        const fileExtension = request.file.mimetype.split('/')[1];
        if(fileExtension != 'jpeg' && fileExtension != 'png'){
            response.status(400).send({ error: "A imagem deve ser um arquivo PNG ou JPG." });
            return;
        }
    }
    next();
}