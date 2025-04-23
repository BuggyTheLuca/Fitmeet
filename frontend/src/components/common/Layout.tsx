import useAuth from "@/hooks/useAuth";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo-with-text.svg";
import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateActivity } from "@/pages/activity/CreateActivity";
import { useRefreshContext } from "@/contexts/activityContext";

export function Layout(){
    const {loggedUser} = useAuth()
    const { triggerRefresh } = useRefreshContext();
    const navigate = useNavigate()

    const [isNewActivityModalOpen, setNewActivityModal] = useState<boolean>(false);

    const handleNewActivity = () => {
        setNewActivityModal(true)
    }

    const closeModal = () => {
        setNewActivityModal(false)
        triggerRefresh();
    }

    return (
        <div className="flex left-[110px] top-[24px] w-full flex-col gap-y-2">
            <header className="flex justify-between">
                <img src={logo} alt="Vite logo" className="w-30 h-auto cursor-pointer" onClick={() => navigate(`/home`)}/>
                <div className="flex items-center gap-10">
                    <Button onClick={handleNewActivity}><CirclePlus /> Criar atividade</Button>
                    {isNewActivityModalOpen && <CreateActivity closeModal={closeModal}/>}
                    <div className="relative cursor-pointer flex flex-col items-center justify-between" onClick={() => navigate('/profile')}>
                        <img src={loggedUser?.avatar} alt="" className="w-24 h-24 object-cover border-4
                            border-primary rounded-full shadow-[0px_0px_0px_6px_white]"/>
                        <div className="absolute inset-0 m-1 border-4 border-white rounded-full"></div>
                        <div className="absolute top-20 px-5 py-1 bg-primary rounded-lg shadow-lg text-white">
                            {loggedUser?.level}
                        </div>
                    </div>
                </div>
            </header>
            <div className="flex flex-col">
                <Outlet/>
            </div>
        </div>
    )
}