import api from "./apiService/api";
import { ActivityResponse, ActivityType } from "../types/activity";
import { ActivityPage, Pageable } from "../types/pageable";
import { LoggedUser, Participant } from "../types/user";

export async function getAllActivityTypes(){
    try {
        const res = await api.get(`/activities/types`, { isProtected: true });
        const activityTypes: ActivityType[] = await res.data;
        return { status: res.status, activityTypes };
    } catch (error) {
        console.log(error)
    }
}

export async function createActivity(newActivity: FormData) {
    const res = await api.post(`/activities/new`, newActivity, { isProtected: true });

    const response = await res.data;
    return { status: res.status, error: response.error}
}

export async function updateActivityData(activity: FormData, activityId: string){
    const res = await api.put(`/activities/${activityId}/update`, activity, { isProtected: true });

    const activityResponse: ActivityResponse = await res.data;
    return { status: res.status, activity: activityResponse}
}

export async function getParticipantsByActivityId(activityId: string){
    const res = await api.get(`/activities/${activityId}/participants`, { isProtected: true });

    const participants: Participant[] = await res.data;
    return { status: res.status, participants };
}

export async function getAllActivitiesPaginated(pageable: Pageable){
    const params = new URLSearchParams({
        page: pageable.page.toString(),
        pageSize: pageable.pageSize.toString()
    });

    if(pageable.filter){
        params.append('typeId', pageable.filter)
    }

    const res = await api.get(`/activities?${params.toString()}`, { isProtected: true });

    const activityPage: ActivityPage = await res.data;
    return { status: res.status, activityPage };
}

export async function getCreatedActivitiesPaginated(pageable: Pageable){
    const params = new URLSearchParams({
        page: pageable.page.toString(),
        pageSize: pageable.pageSize.toString()
    });
  
    const res = await api.get(`/activities/user/creator?${params.toString()}`, { isProtected: true });
  
    const activityPage: ActivityPage = await res.data;
    return { status: res.status, activityPage };
}

export async function getParticipatingActivitiesPaginated(pageable: Pageable){
    const params = new URLSearchParams({
        page: pageable.page.toString(),
        pageSize: pageable.pageSize.toString()
    });
  
    const res = await api.get(`/activities/user/participant?${params.toString()}`, { isProtected: true });
  
    const activityPage: ActivityPage = await res.data;
    return { status: res.status, activityPage };
}

export async function subscribeInActivity(activityId: string){
    const res = await api.post(`/activities/${activityId}/subscribe`, { isProtected: true });

    const participant: Participant = await res.data;
    return { status: res.status, participant };
}

export async function checkInToActivity(activityId: string, confirmationCode: string){
    const res = await api.put(`/activities/${activityId}/check-in`, JSON.stringify({confirmationCode: confirmationCode}), { isProtected: true });

    const participant: Participant = await res.data;
    return { status: res.status, participant };
}

export async function unsubscribeFromActivity(activityId: string){
    const res = await api.delete(`/activities/${activityId}/unsubscribe`, { isProtected: true });

    const participant: Participant = await res.data;
    return { status: res.status, participant };
}

export async function deactivateActivity(activityId: string){
    const res = await api.delete(`/activities/${activityId}/delete`, { isProtected: true });

    const response = await res.data;
    return { status: res.status, response };
}

export async function approveParticipant(activityId: string, approve: any){
    const res = await api.put(`/activities/${activityId}/approve`, JSON.stringify(approve), { isProtected: true });

    const activityResponse: ActivityResponse = await res.data;
    return { status: res.status, activity: activityResponse}
}
