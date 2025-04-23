import { apiUrl } from "@/consts/api";
import useAuth from "@/hooks/useAuth";
import { ActivityType } from "@/types/activity";

export function getActivityTypes(){
    const {loggedUser} = useAuth();
    
    if(loggedUser){
        return fetch(`${apiUrl}/activities/types`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": loggedUser!.token
            }
        })
        .then(async (res) => {
            const activityTypes: ActivityType[] = await res.json()
            
            return { status: res.status, activityTypes}
        })
    }
}