import bcrypt from "bcryptjs";
import { create, getByEmail, findByEmailOrCpf, getUserById, updatePreferences, findUserPreferences, defineUserAvatar, updateUserData, deactivateUser, updateUserLevel, updateUserAchievements } from "../repositories/user-repository";
import { NewUserRequest, UpdateUserRequest } from "../types/user-types";
import { uploadUserAvatar } from "./s3/s3-service";
import { z } from "zod";
import { isEmptyOrUndefinedString } from "../utils/string-utils";
import { AchievementNamesEnum } from "../enums/achievements.enum";


export const createUser = async (newUserRequest: NewUserRequest) => {
    const user = await findByEmailOrCpf(newUserRequest.email, newUserRequest.cpf);

    if(user){
        throw({message: 'O e-mail ou CPF informado já pertence a outro usuário.', code: 409})
    }

    const encryptedPassword = await bcrypt.hash(newUserRequest.password, 10)
    newUserRequest.password = encryptedPassword;

    const userToSave = {...newUserRequest, avatar: `${process.env.S3_ENDPOINT}/${process.env.USER_BUCKET}/default-avatar.jpg`}

    await create(userToSave);
}

export const getUserDetails = async (email: string) => {
    const user = await getByEmail(email)
    return await getUserResponse(user)
}

export const updateUser = async (id: string, updateUser: UpdateUserRequest) => {
    try {
        updateUser = await validateUpdateUserRequest(updateUser)

        if(updateUser.password){
            updateUser.password = await bcrypt.hash(updateUser.password, 10);
        }

        return await updateUserData(id, updateUser)
    } catch (error) {
        throw(error)
    }
}

export const updateUserExperience = async (user: any, incomingExperience: number) => {
    const experienceToNextLevel = Math.round((user.level*(user.level/2))*100)
    const totalExperience = user.xp + (incomingExperience + (user.level * 3))
    let data: {level: number, xp: number};
    if(totalExperience >= experienceToNextLevel){
        data = {level: user.level + 1, xp: totalExperience - experienceToNextLevel}
    }else{
        data = {level: user.level, xp: totalExperience}
    }

    updateUserLevel(data, user.id)

    if(data.level === 5)
        setUserAchievements(user.id, AchievementNamesEnum.LEVEL_5)

    if(data.level === 10)
        setUserAchievements(user.id, AchievementNamesEnum.LEVEL_10)
}

export const setUserAchievements = async (userId: string, achievementNamesEnum: AchievementNamesEnum) => {
    const user = await getUserById(userId)
    const hasAchievement = user?.achievements.some(achievement => achievement.achievement.name == achievementNamesEnum)

    if(!hasAchievement)
        updateUserAchievements(userId, achievementNamesEnum);
}

const validateUpdateUserRequest = async (updateUser: UpdateUserRequest) => {
    const passwordSchema = z.string().min(8).max(32)
    const emailSchema = z.string().email()

    if(isEmptyOrUndefinedString(updateUser.email)){
        updateUser.email = undefined;
    }else if(!emailSchema.safeParse(updateUser.email).success) {
        throw ({code: 400, message: "Email inválido."})
    }

    if(isEmptyOrUndefinedString(updateUser.password)){
        updateUser.password = undefined;
    }else if(!passwordSchema.safeParse(updateUser.password).success) {
        throw ({code: 400, message: "A senha necessita de entre 8 a 32 caracteres."})
    }

    if(isEmptyOrUndefinedString(updateUser.name)){
        updateUser.name = undefined;
    }

    return updateUser;
}

export const getUserPreferences = async (userId: string) => {
    return await findUserPreferences(userId)
}

export const defineUserPreferences = async (userId: string, typeIds: string[]) => {
    await updatePreferences(userId, typeIds)
}

export const setUserAvatar = async (userId: string, file: Express.Multer.File) => {
    let fileExtension = file.mimetype.split('/')[1];
    if(fileExtension != 'jpeg' && fileExtension != 'png'){
        throw({message: 'A imagem deve ser um arquivo PNG ou JPG', code: 400})
    }
    fileExtension = fileExtension == 'jpeg' ? '.jpg' : '.png';
    file.originalname = `${userId}${fileExtension}`;
    const fileUrl = await uploadUserAvatar(file);
    await defineUserAvatar(userId, fileUrl);
    
    return fileUrl
}

export const isUserDeleted = async (id: string) => {
    const user = await getUserById(id)
    
    return (user && user.deletedAt)
}

export const getUserResponse = async (user: any) => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        achievements: user.achievements
      }
}

export const deactivateLoggedUser = async (userId: string) => {
    return await deactivateUser(userId);
}