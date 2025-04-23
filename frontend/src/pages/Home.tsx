import { EditPreferences } from "./activity/EditPreferences";
import { useEffect, useState } from "react";
import { Preference } from "@/types/user";
import { useUser } from "@/hooks/useUser";
import { useActivity } from "@/hooks/useActivity";
import { ActivityResponse, ActivityType } from "@/types/activity";
import { ActivityPage, Pageable } from "@/types/pageable";
import calendarIcon from '../assets/images/calendar-icon.svg'
import participantIcon from '../assets/images/participant-icon.svg'
import privateIcon from '../assets/images/private-icon.svg'
import { formatDate } from "@/utils/format-date";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRefreshContext } from "@/contexts/activityContext";
import { EditActivity } from "./activity/EditActivity";
import { ActivityDetails } from "./activity/AcitivityDetails";

export function Home (){
    const navigate = useNavigate()
    const { shouldRefresh, triggerRefresh } = useRefreshContext();
    const [preferences, setPreferences] = useState<Preference[] | string[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityType[] | null>(null);
    const [activityPage, setActivitiesPage] = useState<ActivityPage | null>(null);
    const [activitiesByType, setActivitiesByType] = useState<ActivityPage[] | null>(null);
    const [selectedActivity, setSelectedActivity] = useState<ActivityResponse | null>(null);
    const [isPreferenceModalOpen, setPreferenceModal] = useState<boolean>(false);
    const [isDetailModalOpen, setDetailModal] = useState<boolean>(false);
    const {getPreferences} = useUser()
    const {getActivityTypes, getActivities} = useActivity()

    useEffect(() => {
        getPreferences()?.then((data) => {
          if(data){
            setPreferences(data.preferences);
            if(data.preferences.length <= 0){
                setPreferenceModal(true)
            }
          }
        });
      }, [getPreferences]);

    useEffect(() => {
      getActivityTypes()?.then((data) => {
        if (data) setActivityTypes(data.activityTypes);
      });
    }, [getActivityTypes, shouldRefresh]);

    useEffect(() => {
      if (!activityTypes) return;
    
      Promise.all(
        activityTypes.map(async (type) => {
          const pageable: Pageable = {
            page: 1,
            pageSize: 6,
            filter: type.id
          };
          const data = await getActivities(pageable);
          return data?.activityPage;
        })
      ).then((pages) => {
        setActivitiesByType(pages.filter(Boolean) as ActivityPage[]);
      });
    }, [getActivities, activityTypes, shouldRefresh]);

    useEffect(() => {
      const pageable: Pageable = {
        page: 1,
        pageSize: 8
      }
      getActivities(pageable)?.then((data) => {
        if(data) setActivitiesPage(data?.activityPage); 
      });
    }, [getActivities, shouldRefresh]);

    const closePreferenceModal = (newPreferences: Preference[] | string[]) => {
        setPreferences(newPreferences);
        setPreferenceModal(false);
        triggerRefresh();
    };

    const closeDetailModal = () => {
      setDetailModal(false);
      setSelectedActivity(null);
    };

    return <>
        {isDetailModalOpen && selectedActivity && (
          <ActivityDetails activity={selectedActivity} closeModal={closeDetailModal} />
        )}
        {isPreferenceModalOpen && <EditPreferences closeModal={closePreferenceModal}/>}
        <div className="flex flex-col w-full h-full gap-2">
            <h1 className="text-[28px] font-bold">Recomendado para você</h1>
          <div className="flex flex-wrap w-full gap-2">
            {activityPage?.activities.map((activity) => 
              <div key={activity.id} className="flex w-[24.5%] flex-col relative cursor-pointer"
                    onClick={() => {
                      setSelectedActivity(activity);
                      setDetailModal(true);
                    }}>
                <img src={activity.image} alt="" className={`w-full h-40 object-cover mt-2 rounded border-4`}/>
                {activity.private ? <img src={privateIcon} alt="" className="absolute px-2 py-4 "/> : null}
                <p>{activity.title}</p>
                <div className="flex text-sm gap-x-3">
                  <img src={calendarIcon} alt="" />
                  <p>{formatDate(activity.scheduledDate)}</p> |
                  <img src={participantIcon} alt="" />
                  <p>{activity.participantCount}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col w-full">
            <h1 className="text-[28px] font-bold">Tipos de atividade</h1>
            <ul className="flex flex-wrap gap-6">
              {activityTypes?.map((activity) => (
                <li key={activity.id}
                    onClick={() => navigate(`/type/${activity.id}`)}
                    className={`cursor-pointer rounded  text-sm transition  gap-3`}>
                  <div className="relative flex flex-col items-center justify-center gap-1">
                    <img src={activity.image} alt="" className={`w-24 h-24 object-cover mt-2 rounded-full border-4`}/>
                    <p>
                        {activity.name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex w-full justify-between flex-wrap">
            {activitiesByType?.map((activityPage, index) => (
              <div key={index} className="w-[48%] gap-4">
                <div className="flex justify-between items-end">
                  <h1 className="text-[28px] font-bold mb-2">{activityTypes?.[index]?.name}</h1>
                  <Button variant={"link"} onClick={() => {
                    navigate(`/type/${activityTypes?.[index]?.id}`)
                  }}>Ver mais</Button>
                </div>
                <div className="flex flex-wrap justify-between gap-4">
                  {activityPage.activities.map((activity) => (
                    <div key={activity.id} className="flex cursor-pointer w-[48%] gap-2" onClick={() => {
                      setSelectedActivity(activity);
                      setDetailModal(true);
                    }}>
                      <img src={activity.image} alt="" className="w-[88px] h-[88px] object-cover mt-2 rounded border-4"/>
                      {activity.private ? <img src={privateIcon} alt="" className="absolute px-1 py-3 "/> : null}
                      <div className="flex flex-col justify-around">
                        <h1>{activity.title}</h1>
                        <div className="flex text-[16px] gap-x-1">
                          <img src={calendarIcon} alt="" />
                          <p>{formatDate(activity.scheduledDate)}</p> |
                          <img src={participantIcon} alt="" />
                          <p>{activity.participantCount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
    </>
}