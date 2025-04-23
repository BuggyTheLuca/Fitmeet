import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export default function validateRequest(schema: ZodSchema, schemaType: ValidatorSchemaTypeEnum) {
  return function requestValidator(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      switch (schemaType) {
        case ValidatorSchemaTypeEnum.PARAMS:
          schema.parse(request.params);
          break;
        case ValidatorSchemaTypeEnum.QUERY:
          schema.parse(request.query);
          break;
        case ValidatorSchemaTypeEnum.BODY:
          schema.parse(request.body);
          break;
        default:
          response.status(500).send({ error: "Erro inesperado." });
    }
      next();
    } catch (error: any) {
      console.log(`Validation error: ${error}`)
      if(error.issues && error.issues[0]?.message == 'Invalid uuid'){
        response.status(400).send({error: "Um ou mais IDs são inválidos."});
        return;
      }
      response.status(400).send({error: "Informe os campos obrigatórios corretamente."});
      return;
    }
  };
}

export enum ValidatorSchemaTypeEnum {
    PARAMS = 'params',
    BODY = 'body',
    QUERY = 'query'
}