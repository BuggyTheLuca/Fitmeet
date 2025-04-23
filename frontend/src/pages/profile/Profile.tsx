import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { UserResponse } from "@/types/user";
import { useEffect, useState } from "react";
import trophiesIcon from "../../assets/images/trophies-icon.svg";
import { ProgressBar } from "@/components/common/ProgressBar";
import { AchievementsCarousel } from "./AchievementsCarousel";
import { ActivityPage, Pageable } from "@/types/pageable";
import { formatDate } from "@/utils/format-date";
import { useRefreshContext } from "@/contexts/activityContext";
import { useActivity } from "@/hooks/useActivity";
import calendarIcon from '../../assets/images/calendar-icon.svg'
import participantIcon from '../../assets/images/participant-icon.svg'
import privateIcon from '../../assets/images/private-icon.svg'
import { useNavigate } from "react-router-dom";
import { ActivityResponse } from "@/types/activity";
import { EditActivity } from "../activity/EditActivity";
import { ActivityDetails } from "../activity/AcitivityDetails";

export function Profile () {
    const [user, setUser] = useState<UserResponse | null>(null);
    
    
    const { shouldRefresh, triggerRefresh } = useRefreshContext();
    const navigate = useNavigate();
    
    const [activityCreated, setActivitiesCreated] = useState<ActivityPage | null>(null);
    const [activityParticipating, setActivitiesParticipating] = useState<ActivityPage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDetailModalOpen, setDetailModal] = useState<boolean>(false);
    const [selectedActivity, setSelectedActivity] = useState<ActivityResponse | null>(null);
    const {getActivitiesCreated, getActivitiesParticipating} = useActivity()
    
    const { getUser } = useUser()

    useEffect(() => {
        getUser()?.then((data) => {
            if (data) setUser(data.user);
          });
    },[getUser])


      const closeDetailModal = () => {
        setDetailModal(false);
        setSelectedActivity(null);
        triggerRefresh();
      };

    useEffect(() => {
        setIsLoading(true);
        const pageable: Pageable = {
            page: 1,
            pageSize: 16
        };
        getActivitiesCreated(pageable)?.then((data) => {
            if(data && data.status == 200) setActivitiesCreated(data?.activityPage);
            setIsLoading(false);
        });
    }, [getActivitiesCreated, shouldRefresh]);

    useEffect(() => {
        
        setIsLoading(true);
        const pageable: Pageable = {
            page: 1,
            pageSize: 16
        };
        getActivitiesParticipating(pageable)?.then((data) => {
            if(data && data.status == 200) setActivitiesParticipating(data?.activityPage);
            setIsLoading(false);
        });
    }, [getActivitiesParticipating, shouldRefresh]);

    const handleSeeMoreCreated = () => {
        const currentPage = activityCreated;
        if(!currentPage) return;

        const nextPage = currentPage.pageSize / 8 + 1;

        const pageable: Pageable = {
            page: nextPage,
            pageSize: 8
        };

        getActivitiesCreated(pageable)?.then((data) => {
            if(data && data.status == 200) {
                const newPage: ActivityPage = {
                    ...currentPage,
                    pageSize: currentPage.pageSize + data.activityPage.pageSize,
                    activities: [...currentPage.activities, ...data.activityPage.activities],
                    page: 1
                };
                setActivitiesCreated(newPage);
            }
            setIsLoading(false);
        });
    }

    const handleSeeMoreParticipating = () => {
        const currentPage = activityParticipating;
        if(!currentPage) return;

        const nextPage = currentPage.pageSize / 8 + 1;

        const pageable: Pageable = {
            page: nextPage,
            pageSize: 8
        };

        getActivitiesParticipating(pageable)?.then((data) => {
            if(data && data.status == 200) {
                const newPage: ActivityPage = {
                    ...currentPage,
                    pageSize: currentPage.pageSize + data.activityPage.pageSize,
                    activities: [...currentPage.activities, ...data.activityPage.activities],
                    page: 1
                };
                setActivitiesParticipating(newPage);
            }
            setIsLoading(false);
        });
    }

    return (user ? <>
        {isDetailModalOpen && selectedActivity && (
          <ActivityDetails activity={selectedActivity} closeModal={closeDetailModal} />
        )}
        <div className="flex flex-col bg-[#FAFAFA] rounded gap-3 mt-[10px] p-[10px]">
        <div className="flex w-full justify-end">
            <Button onClick={() => navigate('/profile/edit')}>Editar perfil</Button>
        </div>
        <div className="flex w-full flex-col">
            <div className="relative  flex flex-col items-center justify-between">
                <img src={user.avatar} alt="" className="w-30 h-30 object-cover border-4
                    border-primary rounded-full shadow-[0px_0px_0px_6px_white]"/>
                <h1 className="text-[32px]">
                    {user?.name}
                </h1>
            </div>
        </div>
        <div className="flex justify-center gap-4">
            <div className="flex flex-col justify-between p-2 bg-[#F5F5F5] w-1/3">
                <div className="flex justify-between gap-4">
                    <div className="flex flex-col">
                        <p>Seu nível é</p>
                        <p>{user.level}</p>
                    </div>
                    <img src={trophiesIcon} alt="" />
                </div>
                <div className="w-full">
                    <ProgressBar currentValue={user.xp} maxValue={user.level * 1000}></ProgressBar>
                </div>
            </div>
            <div className="flex flex-col p-2 bg-[#F5F5F5] w-1/3">
                <AchievementsCarousel achievements={user.achievements}></AchievementsCarousel>
            </div>
        </div>
    </div>
    <h1 className="text-[28px] font-bold">Minhas atividades</h1>
    <div className="flex w-full justify-between flex-wrap pb-2">
        <div className="flex flex-wrap gap-4">
            {activityCreated?.activities.map((activity) => (
                <div key={activity.id} className="cursor-pointer flex w-[24%] gap-2" onClick={() => {
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
    {activityCreated ? activityCreated.activities.length < activityCreated.totalActivities ? <div className="flex justify-center">
                <Button onClick={handleSeeMoreCreated}>Ver mais</Button>
            </div> : null : null}
    <h1 className="text-[28px] font-bold">Histórico de atividades</h1>
    <div className="flex w-full justify-between flex-wrap pb-2">
        <div className="flex flex-wrap gap-4">
            {activityParticipating?.activities.map((activity) => (
                <div key={activity.id} className="cursor-pointer flex w-[24%] gap-2" onClick={() => {
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
    {activityParticipating ? activityParticipating.activities.length < activityParticipating.totalActivities ? <div className="flex justify-center">
                <Button onClick={handleSeeMoreParticipating}>Ver mais</Button>
            </div> : null : null}
    </> : null)
}