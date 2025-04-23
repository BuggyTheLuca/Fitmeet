import useAuth from "./useAuth";
import { useCallback } from "react";
import { LoggedUser } from "../types/user";
import { Pageable } from "../types/pageable";
import { createActivity,
         getAllActivityTypes,
         getAllActivitiesPaginated,
         getParticipantsByActivityId,
         updateActivityData,
         getCreatedActivitiesPaginated,
         getParticipatingActivitiesPaginated,
         subscribeInActivity,
         checkInToActivity,
         unsubscribeFromActivity, 
         deactivateActivity} from "../services/activityService";

export function useActivity() {
    const {loggedUser} = useAuth();


    const getActivityTypes = useCallback(async () => {
      if (!loggedUser) return;
  
      return await getAllActivityTypes(loggedUser);
      
    }, [loggedUser]);


    const setNewActivity = useCallback(async (newActivity: FormData) => {
      if (!loggedUser) return;
      
      return await createActivity(loggedUser, newActivity);

    }, [loggedUser])

    const updateActivity = useCallback(async (activity: FormData, activityId: string) => {
      if (!loggedUser) return;
      
      return await updateActivityData(loggedUser, activity, activityId)

    }, [loggedUser])

    const getActivityParticipants = useCallback(async (activityId: string) => {
      if (!loggedUser) return;
  
      return await getParticipantsByActivityId(loggedUser, activityId)

    }, [loggedUser])

    const getActivities = useCallback(async (pageable: Pageable) => {
      if (!loggedUser) return;

      return await getAllActivitiesPaginated(loggedUser, pageable)

    }, [loggedUser])

    const getActivitiesCreated = useCallback(async (pageable: Pageable) => {
      if (!loggedUser) return;

      return await getCreatedActivitiesPaginated(loggedUser, pageable)

    }, [loggedUser])

    const getActivitiesParticipating = useCallback(async (pageable: Pageable) => {
      if (!loggedUser) return;

      return await getParticipatingActivitiesPaginated(loggedUser, pageable)

    }, [loggedUser])

    const subscribe = useCallback(async (activityId: string) => {
      if (!loggedUser) return;
  
      return await subscribeInActivity(loggedUser, activityId)
    }, [loggedUser])

    const checkIn = useCallback(async (activityId: string, confirmationCode: string) => {
      if (!loggedUser) return;
  
      return await checkInToActivity(loggedUser, activityId, confirmationCode)
      
    }, [loggedUser])

    const unsubscribe = useCallback(async (activityId: string) => {
      if (!loggedUser) return;
  
      return await unsubscribeFromActivity(loggedUser, activityId)
    }, [loggedUser])

    const deleteActivity = useCallback(async (activityId: string) => {
      if (!loggedUser) return;
  
      return await deactivateActivity(loggedUser, activityId)
    }, [loggedUser])

    return {
        getActivityTypes,
        setNewActivity,
        getActivities,
        updateActivity,
        getActivitiesCreated,
        getActivitiesParticipating,
        getActivityParticipants,
        subscribe,
        unsubscribe,
        checkIn,
        deleteActivity
    }
}