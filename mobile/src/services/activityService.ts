import api from "./apiService/api";
import { ActivityResponse, ActivityType } from "../types/activity";
import { ActivityPage, Pageable } from "../types/pageable";
import { LoggedUser, Participant } from "../types/user";

export async function getAllActivityTypes(loggedUser: LoggedUser){
    const res = await api.get(`/activities/types`, {
        headers: {
            Authorization: loggedUser?.token
        }
    });

    const activityTypes: ActivityType[] = await res.data;
    return { status: res.status, activityTypes };
}

export async function createActivity(loggedUser: LoggedUser, newActivity: FormData) {
    const res = await api.post(`/activities/new`, {
        headers: {
          Authorization: loggedUser?.token
        },
        body: newActivity
    });

    const response = await res.data;
    return { status: res.status, error: response.error}
}

export async function updateActivityData(loggedUser: LoggedUser, activity: FormData, activityId: string){
    const res = await api.put(`/activities/${activityId}/update`, {
        headers: {
          Authorization: loggedUser?.token
        },
        body: activity
    });

    const activityResponse: ActivityResponse = await res.data;
    return { status: res.status, activity: activityResponse}
}

export async function getParticipantsByActivityId(loggedUser: LoggedUser, activityId: string){
    const res = await api.get(`/activities/${activityId}/participants`, {
        headers: {
            Authorization: loggedUser?.token
        }
    });

    const participants: Participant[] = await res.data;
    return { status: res.status, participants };
}

export async function getAllActivitiesPaginated(loggedUser: LoggedUser, pageable: Pageable){
    const params = new URLSearchParams({
        page: pageable.page.toString(),
        pageSize: pageable.pageSize.toString()
    });

    if(pageable.filter){
        params.append('typeId', pageable.filter)
    }

    const res = await api.get(`/activities?${params.toString()}`, {
        headers: {
            Authorization: loggedUser?.token
        }
    });

    const activityPage: ActivityPage = await res.data;
    return { status: res.status, activityPage };
}

export async function getCreatedActivitiesPaginated(loggedUser: LoggedUser, pageable: Pageable){
    const params = new URLSearchParams({
        page: pageable.page.toString(),
        pageSize: pageable.pageSize.toString()
    });
  
    const res = await api.get(`/activities/user/creator?${params.toString()}`, {
        headers: {
            Authorization: loggedUser?.token
        }
    });
  
    const activityPage: ActivityPage = await res.data;
    return { status: res.status, activityPage };
}

export async function getParticipatingActivitiesPaginated(loggedUser: LoggedUser, pageable: Pageable){
    const params = new URLSearchParams({
        page: pageable.page.toString(),
        pageSize: pageable.pageSize.toString()
    });
  
    const res = await api.get(`/activities/user/participant?${params.toString()}`, {
        headers: {
            Authorization: loggedUser?.token
        }
    });
  
    const activityPage: ActivityPage = await res.data;
    return { status: res.status, activityPage };
}

export async function subscribeInActivity(loggedUser: LoggedUser, activityId: string){
    const res = await api.post(`/activities/${activityId}/subscribe`, {
        headers: {
            Authorization: loggedUser?.token
        }
    });

    const participant: Participant = await res.data;
    return { status: res.status, participant };
}

export async function checkInToActivity(loggedUser: LoggedUser, activityId: string, confirmationCode: string){
    const res = await api.put(`/activities/${activityId}/check-in`, {
        headers: {
            Authorization: loggedUser?.token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({confirmationCode: confirmationCode})
    });

    const participant: Participant = await res.data;
    return { status: res.status, participant };
}

export async function unsubscribeFromActivity(loggedUser: LoggedUser, activityId: string){
    const res = await api.delete(`/activities/${activityId}/unsubscribe`, {
        headers: {
            Authorization: loggedUser?.token
        }
    });

    const participant: Participant = await res.data;
    return { status: res.status, participant };
}

export async function deactivateActivity(loggedUser: LoggedUser, activityId: string){
    const res = await api.delete(`/activities/${activityId}/delete`, {
        headers: {
            Authorization: loggedUser?.token
        }
    });

    const response = await res.data;
    return { status: res.status, response };
}

export async function approveParticipant(loggedUser: LoggedUser, activityId: string, approve: any){
    console.log(approve, activityId)
    const res = await api.put(`/activities/${activityId}/approve`, {
        headers: {
          Authorization: loggedUser?.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(approve)
    });

    const activityResponse: ActivityResponse = await res.data;
    return { status: res.status, activity: activityResponse}
}
