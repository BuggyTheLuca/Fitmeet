import { apiUrl } from "@/consts/api";
import useAuth from "@/hooks/useAuth";
import { Preference } from "@/types/user";


export function getPreferences(){
    const {loggedUser} = useAuth();
    
    if(loggedUser){
        return fetch(`${apiUrl}/user/preferences`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": loggedUser!.token
            }
        })
        .then(async (res) => {
            const preferences: Preference[] = await res.json()
            
            return { status: res.status, preferences}
        })
    }
}