import { useEffect, useState } from "react";
import { useActivity } from "@/hooks/useActivity";
import { ActivityResponse, ActivityType } from "@/types/activity";
import { ActivityPage, Pageable } from "@/types/pageable";
import calendarIcon from '../../assets/images/calendar-icon.svg'
import participantIcon from '../../assets/images/participant-icon.svg'
import privateIcon from '../../assets/images/private-icon.svg'
import { formatDate } from "@/utils/format-date";
import { useNavigate, useParams } from "react-router-dom";
import { useRefreshContext } from "@/contexts/activityContext";
import { Button } from "@/components/ui/button";
import { ActivityDetails } from "./AcitivityDetails";

export function ActivitiesByType (){
    const navigate = useNavigate()
    const { typeId } = useParams<{ typeId: string }>();
    const { shouldRefresh } = useRefreshContext();
    
    const [activityTypes, setActivityTypes] = useState<ActivityType[] | null>(null);
    const [activityPage, setActivitiesPage] = useState<ActivityPage | null>(null);
    const [activityPageRecommended, setActivitiesPageRecomended] = useState<ActivityPage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [selectedActivity, setSelectedActivity] = useState<ActivityResponse | null>(null);
    
    const [isDetailModalOpen, setDetailModal] = useState<boolean>(false);
    
    const {getActivityTypes, getActivities} = useActivity()

    useEffect(() => {
      getActivityTypes()?.then((data) => {
        if (data) setActivityTypes(data.activityTypes);
      });
    }, [getActivityTypes, shouldRefresh]);

    useEffect(() => {
        if (!typeId) return;
        
        setIsLoading(true);
        const pageable: Pageable = {
            page: 1,
            pageSize: 6,
            filter: typeId
        };
        getActivities(pageable)?.then((data) => {
            if(data && data.status == 200) setActivitiesPageRecomended(data?.activityPage);
            setIsLoading(false);
        });
    }, [getActivities, typeId, shouldRefresh]);

    useEffect(() => {
        if (!typeId) return;
        
        setIsLoading(true);
        const pageable: Pageable = {
            page: 1,
            pageSize: 16,
            filter: typeId
        };
        getActivities(pageable)?.then((data) => {
            if(data && data.status == 200) setActivitiesPage(data?.activityPage);
            setIsLoading(false);
        });
    }, [getActivities, typeId, shouldRefresh]);

    const closeDetailModal = () => {
        setDetailModal(false);
        setSelectedActivity(null);
      };

    const handleSeeMore = () => {
        const currentPage = activityPage;
        if(!currentPage) return;

        const nextPage = currentPage.pageSize / 8 + 1;

        const pageable: Pageable = {
            page: nextPage,
            pageSize: 8,
            filter: typeId
        };

        getActivities(pageable)?.then((data) => {
            if(data && data.status == 200) {
                const newPage: ActivityPage = {
                    ...currentPage,
                    pageSize: currentPage.pageSize + data.activityPage.pageSize,
                    activities: [...currentPage.activities, ...data.activityPage.activities],
                    page: 1
                };
                setActivitiesPage(newPage);
            }
            setIsLoading(false);
        });
    }

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    return <>
        {isDetailModalOpen && selectedActivity && (
            <ActivityDetails activity={selectedActivity} closeModal={closeDetailModal} />
        )}
        <div className="flex flex-col w-full h-full gap-y-3">
            <h1 className="text-[28px] font-bold">Recomendado para você</h1>
            <div className="flex flex-wrap w-full gap-2 pb-2">
                {activityPageRecommended?.activities.map((activity) => 
                    <div key={activity.id} className="flex w-[24.5%] cursor-pointer flex-col" onClick={() => {
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
            <div className="flex w-full justify-between flex-wrap pb-2">
                <div className="flex flex-wrap gap-4">
                    {activityPage?.activities.map((activity) => (
                        <div key={activity.id} className="flex cursor-pointer w-[24%] gap-2" onClick={() => {
                            setSelectedActivity(activity);
                            setDetailModal(true);
                          }}>
                            <img src={activity.image} alt="" className="w-[88px] h-[88px] min-w-[88px] min-h-[88px] object-cover mt-2 rounded border-4" />
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
            {activityPage ? activityPage.activities.length < activityPage.totalActivities ? <div className="flex justify-center">
                <Button onClick={handleSeeMore}>Ver mais</Button>
            </div> : null : null}
            <div className="flex flex-col w-full pb-2">
                <h1 className="text-[28px] font-bold">Tipos de atividade</h1>
                <ul className="flex flex-wrap gap-6">
                    {activityTypes?.map((activityType) => {
                        return activityType.id != typeId ? <li key={activityType.id}
                                onClick={() => navigate(`/type/${activityType.id}`)}
                                className={`cursor-pointer rounded text-sm transition gap-3`}>
                            <div className="relative flex flex-col items-center justify-center gap-1">
                                <img src={activityType.image} alt="" className={`w-24 h-24 object-cover mt-2 rounded-full border-4`}/>
                                <p>
                                    {activityType.name}
                                </p>
                            </div>
                        </li> : null
                    })}
                </ul>
            </div>
        </div>
    </>
}