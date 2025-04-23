import {create, findAllActivities,
        findAllActivityTypes, findCreatedByUserPaginated,
        findAllActivitiesPaginated, getActivityWithParticipants,
        subscribe, update, findAllCreatedByUser, findByUserAsParticipant,
        findByUserAsParticipantPaginated, conclude,
        checkIn, unsubscribe, deleteActivity, approve } from "../repositories/activity-repository";
import { ActivityToSave, NewActivityRequest, UpdateActivityRequest } from "../types/activity-types";
import { uploadActivityImage } from "./s3/s3-service";
import { ActivityQueryFilter, Page } from "../types/query-types";
import { ActivityParticipant } from "@prisma/client";
import { updateUserExperience } from "./user-service";
import { UserSubscriptionStatusEnum } from "../enums/user-subscription-status.enum";

export const getAllActivityTypes = async () => {
    return await findAllActivityTypes();
}

export const createActivity = async (userId: string, newActivityRequest: NewActivityRequest, file: Express.Multer.File) => {
    try {
        let fileExtension = file.mimetype.split('/')[1];
        if(fileExtension != 'jpeg' && fileExtension != 'png'){
            throw({message: 'A imagem deve ser um arquivo PNG ou JPG', code: 400})
        }
        fileExtension = fileExtension == 'jpeg' ? '.jpg' : '.png';

        const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString()

        file.originalname = `${userId}${confirmationCode}${fileExtension}`;
        const fileUrl = await uploadActivityImage(file);
        
        const activityToSave: ActivityToSave = {
            ...newActivityRequest,
            image: fileUrl,
            createdAt: new Date(),
            creatorId: userId,
            confirmationCode: confirmationCode
        }
        return await create(activityToSave);
    } catch (error) {
        throw (error)
    }
}

export const updateActivity = async (userId: string, updateActivityRequest: UpdateActivityRequest, file?: Express.Multer.File) => {
    const activity = await getActivityWithParticipants(updateActivityRequest.id)

    if(!activity){
        throw({message: 'Atividade não encontrada.', code: 404})
    }
    if(activity.creatorId != userId){
        throw({message: 'Apenas o criador da atividade pode editá-la.', code: 403})
    }

    let fileUrl;
    if(file){
        let fileExtension = file.mimetype.split('/')[1];
        if(fileExtension != 'jpeg' && fileExtension != 'png'){
            throw({message: 'A imagem deve ser um arquivo PNG ou JPG', code: 400})
        }
        fileExtension = fileExtension == 'jpeg' ? '.jpg' : '.png';

        file.originalname = `${userId}${activity.confirmationCode}${fileExtension}`;
        fileUrl = await uploadActivityImage(file);
    }
    
    const activityToUpdate = {
        updateActivityRequest,
        image: fileUrl,
    }
    
    return await update(activityToUpdate);
}

export const getAllActivities = async (filter: ActivityQueryFilter, userId: string) => {
    return await findAllActivities(filter, userId);
}

export const getAllActivitiesPaginated = async (filter: ActivityQueryFilter, page: Page, userId: string) => {
    return await findAllActivitiesPaginated(filter, page, userId);
}

export const getActivitiesByCreator = async (page: Page, userId: string) => {
    return await findCreatedByUserPaginated(page, userId);
}

export const getAllActivitiesByCreator = async (userId: string) => {
    return await findAllCreatedByUser(userId);
}

export const getActivitiesByUserAsParticipant = async (page: Page, userId: string) => {
    return await findByUserAsParticipantPaginated(page, userId)
}

export const getAllActivitiesByUserAsParticipant = async (filter: ActivityQueryFilter, userId: string) => {
    return await findByUserAsParticipant(filter, userId);
}

export const subscribeToActivity = async (activityId: string, userId: string) => {
    const activity = await getActivityWithParticipants(activityId)

    if(!activity){
        throw({message: 'Atividade não encontrada.', code: 404})
    }

    validateSubscribe(activity, userId);

    let subscription;
    if(activity.private)
        subscription = await subscribe(activityId, userId);
    else
        subscription = await subscribe(activityId, userId, true);

    return subscription;
}

export const approveParticipant = async (activityId: string, approveRequest: {participantId: string, approved: boolean}, loggedUserId: string) => {
    const activity = await getActivityWithParticipants(activityId)

    if(!activity){
        throw({message: 'Atividade não encontrada.', code: 404})
    }

    if(activity.creatorId != loggedUserId)
        throw({message: 'Apenas o criador da atividade pode aprovar ou negar participantes.', code: 403})

    const participantSubscribed = activity.participants.find((participant: ActivityParticipant) => participant.userId == approveRequest.participantId)
    if(!participantSubscribed)
        throw({message: 'Usuário não encontrado.', code: 404})

    return await approve(approveRequest.approved, participantSubscribed.id)
}

export const concludeActivity = async (activityId: string, userId: string) => {
    const activityToValidate = await getActivityWithParticipants(activityId)

    if(!activityToValidate)
        throw({message: 'Atividade não encontrada.', code: 404})

    if(activityToValidate.completedAt)
        throw({message: 'Atividade já foi concluida.', code: 409})

    
    if(activityToValidate.creatorId != userId)
        throw({message: 'Apenas o criador da atividade pode concluí-la.', code: 403})


    await conclude(activityId, new Date())
    
}

export const checkInToActivity = async (activityId: string, userId: string, confirmationCode: string) => {
    const activityToValidate = await getActivityWithParticipants(activityId)

    if(!activityToValidate)
        throw({message: 'Atividade não encontrada.', code: 404})

    if(activityToValidate.completedAt)
        throw({message: 'Atividade já foi concluida.', code: 409})

    const participant = activityToValidate.participants.find((participant: ActivityParticipant) => participant.userId == userId)

    if(participant?.confirmedAt)
        throw({message: 'Você já confirmou sua participação nesta atividade.', code: 409})

    if(activityToValidate.confirmationCode != confirmationCode)
        throw({message: 'Código de confirmação incorreto.', code: 401})   

    if(!participant || !participant.approved)
        throw({message: 'Você não está inscrito nesta atividade.', code: 400})

    const checkedIn = await checkIn(participant.id)

    await updateUserExperience(activityToValidate.creator, 25)
    await updateUserExperience(participant.user, 50)

    if(checkedIn)
        return ({message: 'Participação confirmada com sucesso.'})
    else
        throw({message: 'Erro inesperado.', code: 500})
}

export const unsubscribeOfActivity = async (activityId: string, userId: string) => {
    const activityToValidate = await getActivityWithParticipants(activityId)

    if(!activityToValidate)
        throw({message: 'Atividade não encontrada.', code: 404})

    const participant = activityToValidate.participants.find((participant: ActivityParticipant) => participant.userId == userId)

    if(!participant)
        throw({message: 'Você não está inscrito nesta atividade.', code: 400})

    if(participant.confirmedAt)
        throw({message: 'Não é possível cancelar sua inscrição, pois sua presença já foi confirmada.', code: 403})

    if(activityToValidate.completedAt)
        throw({message: 'Atividade já foi concluida.', code: 409})

    return await unsubscribe(participant.id);
}

export const deleteActivityById = async (activityId: string, userId: string) => {
    const activityToValidate = await getActivityWithParticipants(activityId)

    if(!activityToValidate)
        throw({message: 'Atividade não encontrada.', code: 404})

    if(activityToValidate.creatorId != userId)
        throw({message: 'Apenas o criador da atividade pode exclui-la.', code: 403})

    return await deleteActivity(activityId)
}

export const getActivityParticipants = async (activityId: string) => {
    const activityWithParticipants = await getActivityWithParticipants(activityId)
    if(!activityWithParticipants){
        throw({message: 'Atividade não encontrada.', code: 404})
    }
    return activityWithParticipants.participants.map(participant => ({
        id: participant.id,
        userId: participant.userId,
        name: participant.user.name,
        avatar: participant.user.avatar,
        subscriptionStatus: participant.approved === true 
        ? UserSubscriptionStatusEnum.SUBSCRIBED 
        : participant.approved === null 
              ? UserSubscriptionStatusEnum.PENDING 
              : UserSubscriptionStatusEnum.NOT_SUBSCRIBED,
        confirmedAt: participant.confirmedAt 
    }))
}

const validateSubscribe = (activity: any, userId: string) => {
    
    if(activity.creatorId == userId){
        throw({message: 'O criador da atividade não pode se inscrever como um participante.', code: 409})
    }
    if(activity.completedAt){
        throw({message: 'Não é possível se inscrever em uma atividade concluída.', code: 409})
    }
    const isUserSubscribe = activity.participants.some((participant: ActivityParticipant) => participant.userId == userId)
    if(isUserSubscribe){
        throw({message: 'Você já se registrou nesta atividade.', code: 409})
    }
}
