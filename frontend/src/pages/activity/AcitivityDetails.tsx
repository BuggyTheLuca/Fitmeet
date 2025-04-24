import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../../components/ui/dialog';
import { ActivityResponse } from "@/types/activity";
import { Button } from "@/components/ui/button";

import calendarIcon from '../../assets/images/calendar-icon.svg'
import participantIcon from '../../assets/images/participant-icon.svg'
import privateIcon from '../../assets/images/private-icon.svg'
import cancelledIcon from "../../assets/images/cancelled-activity-icon.svg"
import codeIcon from "../../assets/images/code-icon.svg"
import MapClickMarker from "@/components/common/MapClickMarker";
import { formatDate } from "@/utils/format-date";
import { Participant } from "@/types/user";
import { useActivity } from "@/hooks/useActivity";
import useAuth from "@/hooks/useAuth";
import { DialogClose } from "@radix-ui/react-dialog";
import { Ban } from 'lucide-react';
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { EditActivity } from "./EditActivity";
import { VisuallyHidden } from "@/components/common/VisuallyHidden";
import { useRefreshContext } from "@/contexts/activityContext";

export function ActivityDetails({ activity, closeModal }: {activity: ActivityResponse, closeModal: () => void }) {

  const [participants, setParticipants] = useState<Participant[] | null>(null)

  const [userAsParticipant, setUserAsParticipant] = useState<Participant | null>(null)

  const [isEditModalOpen, setEditActivityModal] = useState<boolean>(false);

  const [currentActivity, setCurrentActivity] = useState<ActivityResponse>(activity)

  const [isTimeToActivity, setTimeToActivity] = useState<boolean>(false)
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false)
  const [isInProgress, setIsInProgress] = useState<boolean>(false)
  const [isEnded, setIsEnded] = useState<boolean>(false)
  const [isCreator, setIsCreator] = useState<boolean>(false)

  const {loggedUser} = useAuth()

  const {subscribe, unsubscribe, checkIn, approve, getActivityParticipants} = useActivity()


  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      const targetDate = new Date(currentActivity.scheduledDate);
      const now = new Date();

      const diffInMs = targetDate.getTime() - now.getTime();
      const diffInMinutes = diffInMs / (1000 * 60);
      setTimeToActivity(diffInMinutes <= 30 && diffInMinutes > 0);
      setIsInProgress(diffInMinutes < 0 && !currentActivity.completedAt)
      setIsEnded(!!currentActivity.completedAt)
  }, [])

  useEffect(() => {
    if(!loggedUser) return;

    setIsCreator(loggedUser.id === currentActivity.creator.id)
  }, [loggedUser])

  useEffect(() => {
      getActivityParticipants(currentActivity.id)?.then((data) => {
          if (data){
              setParticipants(data.participants);
              if(loggedUser){
                  const participating = data.participants.find((participant) => loggedUser.id == participant.userId)
                  if(participating)
                      setUserAsParticipant(participating);
              }
          }

      });
  },[getActivityParticipants])
  
  const closeEditModal = (isCancelled: boolean, updatedActivity?: ActivityResponse) => {
    setEditActivityModal(false);

    if(updatedActivity)
      setCurrentActivity(updatedActivity)

    if(isCancelled)
      closeModal();
  };

  async function handleSubscribe () {
      const response = await subscribe(currentActivity.id)
      if(response)
          setUserAsParticipant(response.participant)
  }

  async function handleUnsubscribe () {
      const response = await unsubscribe(currentActivity.id)
      if(response && response.status == 200)
          setUserAsParticipant(null)
  }

  async function handleCheckin () {
      const confirmationCode = codeInputRef.current?.value;
      if(confirmationCode){
          const response = await checkIn(activity.id, confirmationCode)
          if(response && response.status == 200)
              setIsCheckedIn(true)
      }
  }

  async function handleApprove (participantId: string, approved: boolean) {
    const response = await approve(currentActivity.id, {participantId, approved})

    if (response && response.status === 200) {
      setParticipants((prev) => {
        if (!prev) return prev;
        return prev.map((p) =>
          p.id === participantId
            ? { ...p, subscriptionStatus: approved ? "APPROVED" : "REJECTED" }
            : p
        );
      });
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const borderColorByStatus = (status: string) => {
    switch (status){
      case "APPROVED": return 'border-primary';
      case "REJECTED": return 'border-red-500';
      case "WAITING": return 'border-grey-500';
      default: return '';
    }
  };

  return (
    isEditModalOpen ?
      <EditActivity activity={currentActivity} closeModal={closeEditModal} />
    :
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent size="lg">
        <DialogClose asChild>
            <button
            className="absolute right-4 top-4 text-xl font-bold text-gray-500 hover:text-gray-700"
            aria-label="Fechar"
            onClick={closeModal}
            >
            X
            </button>
        </DialogClose>
        <VisuallyHidden>
          <DialogTitle>Detalhes da atividade</DialogTitle>
          <DialogDescription>Detalhes da atividade</DialogDescription>
        </VisuallyHidden>
        <div className="space-y-4 flex justify-between items-start gap-x-2">
          <div className="flex flex-col justify-between h-full gap-10">
              <div>
                <div className="flex w-[384px] h-[224px] rounded mx-auto items-center justify-center border border-3 border-grey">
                  <div className="flex w-auto h-auto rounded mx-auto items-center justify-center cursor-pointer overflow-hidden"
                      onClick={() => fileInputRef.current?.click()}>
                    <img src={currentActivity.image}
                        alt="Preview"
                        className={'w-[384px] h-[224px]'}/>
                  </div>
                </div>
                <div>
                  <h1 className="text-[28px] font-bold">{currentActivity.title}</h1>
                  <p>{currentActivity.description}</p>
                </div>
                <div>
                  <div className="flex gap-2">
                    <img src={calendarIcon} alt="" />
                    <p>{formatDate(currentActivity.scheduledDate)}</p>
                  </div>
                  <div className="flex gap-2">
                    <img src={participantIcon} alt="" />
                    <p>{currentActivity.participantCount} participantes</p>
                  </div>
                  {currentActivity.private ? 
                    <div className="flex gap-2">
                      <img src={privateIcon} alt="" />
                      <p>Mediante aprovação</p>
                    </div>
                  : null}
                </div>
              </div>
              
              <div className="flex justify-start">
              {userAsParticipant ? 
                  (() => {
                      switch (userAsParticipant.subscriptionStatus) {
                        case "APPROVED":
                          return <>
                          {(isInProgress && userAsParticipant.confirmedAt) || isEnded ? (
                            <div className="flex flex-col w-full items-start">
                              <Button variant={'outline'} disabled={true}>
                                  {isInProgress ? 'Atividade em andamento' : ''}
                                  {isEnded ? 'Atividade encerrada' : ''}
                              </Button>
                            </div>
                          ) : isTimeToActivity || isInProgress ? (
                            <div className="flex flex-col w-full items-start">
                              <h1 className="text-[28px] font-bold">Faça seu check-in</h1>
                              <div className="flex w-full gap-5">
                                <input
                                  disabled={isCheckedIn}
                                  type="text"
                                  ref={codeInputRef}
                                  className="w-2/3 p-2 h-full"
                                  placeholder="Código de confirmação"
                                />
                                <Button disabled={isCheckedIn} onClick={handleCheckin}>
                                  {isCheckedIn ? 'Confirmado' : <Check className="w-5 h-5 text-white" />}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button size="sm" variant={'danger'} onClick={handleUnsubscribe}>
                              Desinscrever
                            </Button>
                          )}
                        </>
                        case "WAITING":
                          return <Button size="sm" disabled={true}>
                                      Aguardando aprovação
                                  </Button>
                        case "REJECTED":
                          return <Button size="sm" variant={'destructive'} disabled={true}>
                                      <Ban className="w-5 h-5 text-white" /> Inscrição negada
                                  </Button>
                        default:
                          return null
                      }
                    })()
                  : isCreator ? 
                    <Button size="sm" variant={'outline'} onClick={() => setEditActivityModal(true)}>
                      Editar
                    </Button>
                    : currentActivity.deletedAt ?
                      <Button variant={'destructive'} disabled={true}><img src={cancelledIcon} alt="" />Encerrada</Button>
                      :
                      <Button size="sm" onClick={handleSubscribe}>
                        Participar
                      </Button>
              }</div>

          </div>

          <div className="flex justify-between max-w-full h-full flex-col gap-10">
            <div>
                <h1 className="text-[28px] font-bold">Ponto de encontro</h1>
                <MapClickMarker center={currentActivity.address}/>
            </div>
            <div className="flex flex-col flex-wrap gap-4">
              <h1 className="text-[28px] font-bold">Participantes</h1>
              <div className="overflow-y-auto">
                <div className="flex w-full gap-2">
                    <img src={currentActivity.creator.avatar} alt="" className="w-[88px] h-[88px] min-w-[88px] min-h-[88px] object-cover mt-2 rounded-full border-4 border-primary" />
                    <div className="flex flex-col justify-around">
                        <h1>{currentActivity.creator.name}</h1>
                        <p>Organizador</p>
                    </div>
                </div>
                {participants?.map((participant) => ( 
                  <div key={participant.id} className="flex justify-between items-center w-full gap-2">
                    <div className="flex w-full gap-2">
                      <img src={participant.avatar} alt=""
                        className={`w-[88px] h-[88px] min-w-[88px] min-h-[88px] object-cover mt-2 rounded-full border-4 ${borderColorByStatus(participant.subscriptionStatus)}`} />
                      <div className="flex flex-col justify-around">
                          <h1>{participant.name}</h1>
                      </div>
                    </div>
                    {isCreator ?
                      <div className="flex gap-2 ">
                        <Button size={'rounded'} onClick={() => handleApprove(participant.id, true)}>
                          <Check/>
                        </Button>
                        <Button size={'rounded'} variant={'destructive'} onClick={() => handleApprove(participant.id, false)}>
                          <X/>
                        </Button>
                      </div>
                    :null}
                  </div> 
                ))}
              </div>
            </div>
            {isCreator && isInProgress 
                ? <div className=" flex flex-col rounded bg-[#F5F5F5] w-full h-[120px] px-5 justify-center items-start gap-3">
                  <div className="flex">
                    <img src={codeIcon} alt="" />
                    <p>Código de check-in</p>
                  </div>
                  <h1>{activity.confirmationCode}</h1>
                </div>
                : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
