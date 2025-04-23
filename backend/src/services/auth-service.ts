import { getByEmail } from "../repositories/user-repository";
import LoginRequest from "../types/login-request";
import bcrypt from "bcryptjs";
import { getUserResponse } from "./user-service";

export const login = async (loginRequest: LoginRequest) => {
    const user = await getByEmail(loginRequest.email)

    if(!user){
        throw ({code: 404, message: "Usuário não encontrado."})
    }

    const isPasswordCorrect = await bcrypt.compare(loginRequest.password, user.password);
    

    if(!isPasswordCorrect){
        throw ({code: 401, message: "Senha incorreta."})
    }

    if(user.deletedAt){
        throw ({code: 403, message: "Esta conta foi desativada e não pode ser utilizada."})
    }

    return await getUserResponse(user);
}