import { apiUrl } from "../consts/api";
import { ActivityType } from "../types/activity";
import { ActivityPage, Pageable } from "../types/pageable";
import { LoggedUser, Participant } from "../types/user";

export async function getAllActivityTypes(loggedUser: LoggedUser){
    const res = await fetch(`${apiUrl}/activities/types`, {
        method: "GET",
        headers: {
            Authorization: loggedUser?.token
        }
    });

    const activityTypes: ActivityType[] = await res.json();
    return { status: res.status, activityTypes };
}

export async function createActivity(loggedUser: LoggedUser, newActivity: FormData) {
    const res = await fetch(`${apiUrl}/activities/new`, {
        method: "POST",
        headers: {
          Authorization: loggedUser?.token
        },
        body: newActivity
    });

    const response = await res.json()
    return { status: res.status, error: response.error}
}

export async function updateActivityData(loggedUser: LoggedUser, activity: FormData, activityId: string){
    const res = await fetch(`${apiUrl}/activities/${activityId}/update`, {
        method: "PUT",
        headers: {
          Authorization: loggedUser?.token
        },
        body: activity
    });

    const response = await res.json()
    return { status: res.status, error: response.error}
}

export async function getParticipantsByActivityId(loggedUser: LoggedUser, activityId: string){
    const res = await fetch(`${apiUrl}/activities/${activityId}/participants`, {
        method: "GET",
        headers: {
            Authorization: loggedUser?.token
        },
    });

    const participants: Participant[] = await res.json();
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

    const res = await fetch(`${apiUrl}/activities?${params.toString()}`, {
        method: "GET",
        headers: {
            Authorization: loggedUser?.token
        },
    });

    const activityPage: ActivityPage = await res.json();
    return { status: res.status, activityPage };
}

export async function getCreatedActivitiesPaginated(loggedUser: LoggedUser, pageable: Pageable){
    const params = new URLSearchParams({
        page: pageable.page.toString(),
        pageSize: pageable.pageSize.toString()
      });
  
      const res = await fetch(`${apiUrl}/activities/user/creator?${params.toString()}`, {
        method: "GET",
        headers: {
            Authorization: loggedUser?.token
        },
      });
  
      const activityPage: ActivityPage = await res.json();
      return { status: res.status, activityPage };
}

export async function getParticipatingActivitiesPaginated(loggedUser: LoggedUser, pageable: Pageable){
    const params = new URLSearchParams({
        page: pageable.page.toString(),
        pageSize: pageable.pageSize.toString()
      });
  
      const res = await fetch(`${apiUrl}/activities/user/participant?${params.toString()}`, {
        method: "GET",
        headers: {
            Authorization: loggedUser?.token
        },
      });
  
      const activityPage: ActivityPage = await res.json();
      return { status: res.status, activityPage };
}

export async function subscribeInActivity(loggedUser: LoggedUser, activityId: string){
    const res = await fetch(`${apiUrl}/activities/${activityId}/subscribe`, {
        method: "POST",
        headers: {
            Authorization: loggedUser?.token
        },
    });

    const participant: Participant = await res.json();
    return { status: res.status, participant };
}

export async function checkInToActivity(loggedUser: LoggedUser, activityId: string, confirmationCode: string){
    const res = await fetch(`${apiUrl}/activities/${activityId}/check-in`, {
        method: "POST",
        headers: {
            Authorization: loggedUser?.token
        },
        body: confirmationCode
    });

    const participant: Participant = await res.json();
    return { status: res.status, participant };
}

export async function unsubscribeFromActivity(loggedUser: LoggedUser, activityId: string){
    const res = await fetch(`${apiUrl}/activities/${activityId}/unsubscribe`, {
        method: "DELETE",
        headers: {
            Authorization: loggedUser?.token
        }
    });

    const participant: Participant = await res.json();
    return { status: res.status, participant };
}

export async function deactivateActivity(loggedUser: LoggedUser, activityId: string){
    const res = await fetch(`${apiUrl}/activities/${activityId}/delete`, {
        method: "DELETE",
        headers: {
            Authorization: loggedUser?.token
        }
    });

    const response = await res.json();
    return { status: res.status, response };
}
