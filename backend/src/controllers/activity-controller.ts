import { Request, Response } from "express";
import { approveParticipant, checkInToActivity, concludeActivity, createActivity, getActivitiesByCreator, getActivitiesByUserAsParticipant, getActivityParticipants, getAllActivities, getAllActivitiesByCreator, getAllActivitiesByUserAsParticipant, getAllActivitiesPaginated, getAllActivityTypes, subscribeToActivity, unsubscribeOfActivity, updateActivity } from "../services/activity-service";
import { dealWithError } from "../utils/error-utils";
import { NewActivityRequest, UpdateActivityRequest } from "../types/activity-types";
import { ActivityQueryFilter, Page } from "../types/query-types";
import { isEmptyOrUndefinedString } from "../utils/string-utils";
import { AchievementNamesEnum } from "../enums/achievements.enum";
import { setUserAchievements } from "../services/user-service";
import { UserSubscriptionStatusEnum } from "../enums/user-subscription-status.enum";

export const findAll = async (request: Request, response: Response) => {
    try {
        const userId = request.loggedUser.id;
        const filter: ActivityQueryFilter = request.query as ActivityQueryFilter
        const activities = await getAllActivities(filter, userId)
        response.status(200).send(activities)
    } catch (error: any) {
        dealWithError(response, error)
    }
}

export const findAllPaginated = async (request: Request, response: Response) => {
    try {
        const userId = request.loggedUser.id;
        const filter: ActivityQueryFilter = request.query as ActivityQueryFilter
        let page: Page;
        if(request.query.page && request.query.pageSize){
            page = {
                page: parseFloat(request.query.page as string),
                pageSize: parseFloat(request.query.pageSize as string)
            }
        } else {
            page = {page: 1, pageSize: 10}
        }
        const activitiesPaginated = await getAllActivitiesPaginated(filter, page, userId)
        response.status(200).send(activitiesPaginated)
    } catch (error: any) {
        dealWithError(response, error)
    }
}

export const findAllActivityTypes = async (request: Request, response: Response) => {
    try {
        const activityTypes = await getAllActivityTypes();
        response.status(200).send(activityTypes);
    } catch (error: any) {
        dealWithError(response, error);
    }
}

export const findCreatedByUser = async (request: Request, response: Response) => {
    try{
        const userId = request.loggedUser.id;
        let page: Page;
        if(request.query.page && request.query.pageSize){
            page = {
                page: parseFloat(request.query.page as string),
                pageSize: parseFloat(request.query.pageSize as string)
            }
        } else {
            page = {page: 1, pageSize: 10}
        }
        const activitiesPaginated = await getActivitiesByCreator(page, userId)
        response.status(200).send(activitiesPaginated)
    }catch(error: any){
        dealWithError(response, error)
    }
}

export const findAllCreatedByUser = async (request: Request, response: Response) => {
    try{
        const userId = request.loggedUser.id;
        const activities = await getAllActivitiesByCreator(userId)
        response.status(200).send(activities)
    }catch(error: any){
        dealWithError(response, error)
    }
}

export const findByUserAsParticipant = async (request: Request, response: Response) => {
    try{
        const userId = request.loggedUser.id;
        const page: Page = {
            page: parseFloat(request.query.page as string),
            pageSize: parseFloat(request.query.pageSize as string)
        }
        const activitiesPaginated = await getActivitiesByUserAsParticipant(page, userId)
        response.status(200).send(activitiesPaginated)
    }catch(error: any){
        dealWithError(response, error)
    }
}

export const findAllByUserAsParticipant = async (request: Request, response: Response) => {
    try{
        const userId = request.loggedUser.id;
        const activityQueryFilter: ActivityQueryFilter = {
            order: request.query.order as string,
            orderBy: request.query.orderBy as string
        }
        const activitiesPaginated = await getAllActivitiesByUserAsParticipant(activityQueryFilter, userId)
        response.status(200).send(activitiesPaginated)
    }catch(error: any){
        dealWithError(response, error)
    }
}

export const findParticipantsById = async (request: Request, response: Response) => {
    try {
        const activityId = request.params.id
        const participants = await getActivityParticipants(activityId)

        response.status(200).send(participants);
    } catch (error: any) {
        dealWithError(response, error)
    }
}

export const create = async (request: Request, response: Response) => {
    try {
        if(!request.file){
            response.status(400).send({error: "Informe os campos obrigatórios corretamente."});
            return;
        }
        const file = request.file;
        const userId = request.loggedUser.id;
        const newActivityRequest: NewActivityRequest = {
            title: request.body.title,
            description: request.body.description,
            typeId: request.body.typeId,
            address: JSON.parse(request.body.address),
            scheduledDate: new Date(request.body.scheduledDate),
            private: JSON.parse(request.body.private)
        }

        const newActivityResponse = await createActivity(userId, newActivityRequest, file)
        setUserAchievements(userId, AchievementNamesEnum.FIRST_ACTIVITY_CREATED)
        
        response.status(201).send(newActivityResponse)
    } catch (error: any) {
        dealWithError(response, error)
    }
}

export const subscribe = async (request: Request, response: Response) => {
    try {
        const activityId = request.params.id
        const userId = request.loggedUser.id
        const subscription = await subscribeToActivity(activityId, userId)
        if(subscription.subscriptionStatus == UserSubscriptionStatusEnum.SUBSCRIBED)
            setUserAchievements(userId, AchievementNamesEnum.FIRST_SUBSCRIBE)
        
        response.status(200).send(subscription);
    } catch (error: any) {
        dealWithError(response, error)
    }
}

export const update = async (request: Request, response: Response) => {
    try {
        const file = request.file;
        const userId = request.loggedUser.id
        const updateActivityRequest: UpdateActivityRequest = {
            id: request.params.id,
            title: !isEmptyOrUndefinedString(request.body.title) ? request.body.title : undefined,
            description: !isEmptyOrUndefinedString(request.body.description) ? request.body.description : undefined,
            typeId: request.body.typeId,
            address: !isEmptyOrUndefinedString(request.body.address) ? JSON.parse(request.body.address) : undefined,
            scheduledDate: new Date(request.body.scheduledDate),
            private: !isEmptyOrUndefinedString(request.body.private) ? JSON.parse(request.body.private) : undefined
        }

        const newActivityResponse = await updateActivity(userId, updateActivityRequest, file)
        
        response.status(200).send(newActivityResponse)
    } catch (error: any) {
        dealWithError(response, error)
    }
}

export const conclude = async (request: Request, response: Response) => {
    try {
        const userId = request.loggedUser.id
        const activityId = request.params.id
        await concludeActivity(activityId, userId)
        response.status(200).send({message: "Atividade concluída com sucesso."})
    } catch (error: any) {
        dealWithError(response, error)
    }
}

export const approve = async (request: Request, response: Response) => {
    try {
        const activityId = request.params.id;
        const approveRequest: {participantId: string, approved: boolean} = request.body
        const loggedUserId = request.loggedUser.id;
        const isApproved = await approveParticipant(activityId, approveRequest, loggedUserId)

        if(isApproved){
            setUserAchievements(approveRequest.participantId, AchievementNamesEnum.FIRST_SUBSCRIBE)
            response.status(200).send({message: 'Solicitação de participação aprovada com sucesso.'})
        }
        else
            response.status(200).send({message: 'Solicitação de participação reprovada com sucesso.'})
        
    } catch (error: any) {
        dealWithError(response, error)
    }
}

export const checkIn = async (request: Request, response: Response) => {
    try {
        const activityId = request.params.id;
        const userId = request.loggedUser.id
        const confirmationCode = request.body.confirmationCode
        const responseMessage = await checkInToActivity(activityId, userId, confirmationCode)
        setUserAchievements(userId, AchievementNamesEnum.FIRST_CHECK_IN)
        response.status(200).send(responseMessage)
    } catch (error: any) {
        dealWithError(response, error)
    }
}

export const unsubscribe = async (request: Request, response: Response) => {
    try {
        const activityId = request.params.id;
        const userId = request.loggedUser.id;
        await unsubscribeOfActivity(activityId, userId)
        response.status(200).send({message: 'Participação cancelada com sucesso.'})
    } catch (error: any) {
        dealWithError(response, error)
    }
}

export const deleteActivity = async (request: Request, response: Response) => {
    try {
        const activityId = request.params.id;
        const userId = request.loggedUser.id;
        await unsubscribeOfActivity(activityId, userId)
        response.status(200).send({message: 'Atividade excluida com sucesso.'})
    } catch (error: any) {
        dealWithError(response, error)
    }
}