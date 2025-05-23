import { useCallback } from "react";
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
         deactivateActivity,
         approveParticipant,
         concludeActivity} from "../services/activityService";

export function useActivity() {

    const getActivityTypes = useCallback(async () => {
      return await getAllActivityTypes();
    }, []);


    const setNewActivity = useCallback(async (newActivity: FormData) => {
      return await createActivity(newActivity);
    }, [])

    const updateActivity = useCallback(async (activity: FormData, activityId: string) => {
      return await updateActivityData(activity, activityId)

    }, [])

    const conclude = useCallback(async (activityId: string) => {
      return await concludeActivity(activityId)

    }, [])

    const getActivityParticipants = useCallback(async (activityId: string) => {
      return await getParticipantsByActivityId(activityId)
    }, [])

    const getActivities = useCallback(async (pageable: Pageable) => {
      return await getAllActivitiesPaginated(pageable)

    }, [])

    const getActivitiesCreated = useCallback(async (pageable: Pageable) => {
      return await getCreatedActivitiesPaginated(pageable)

    }, [])

    const getActivitiesParticipating = useCallback(async (pageable: Pageable) => {
      return await getParticipatingActivitiesPaginated(pageable)

    }, [])

    const subscribe = useCallback(async (activityId: string) => {
      return await subscribeInActivity(activityId)
    }, [])

    const checkIn = useCallback(async (activityId: string, confirmationCode: string) => {
      return await checkInToActivity(activityId, confirmationCode)
    }, [])

    const unsubscribe = useCallback(async (activityId: string) => {
      return await unsubscribeFromActivity(activityId)
    }, [])

    const deleteActivity = useCallback(async (activityId: string) => {
      return await deactivateActivity(activityId)
    }, [])

    const approve = useCallback(async (activityId: string, approveRequest: any) => {
      return await approveParticipant(activityId, approveRequest)
    }, [])

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
        deleteActivity,
        approve,
        conclude
    }
}