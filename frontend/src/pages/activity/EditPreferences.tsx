import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { ActivityType } from "@/types/activity";
import { Preference } from "@/types/user";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/hooks/useActivity";
import { useUser } from "@/hooks/useUser";
import { DialogClose } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@/components/common/VisuallyHidden";

export function EditPreferences({ closeModal }: {closeModal: (newPreferences: Preference[] | string[]) => void}) {
  const [activityTypes, setActivityTypes] = useState<ActivityType[] | null>(null);

  const [selected, setSelected] = useState<string[]>([]);

  const {getActivityTypes} = useActivity()
  const {setPreferences} = useUser()


  useEffect(() => {
    getActivityTypes()?.then((data) => {
      if(data)
        setActivityTypes(data.activityTypes);
    });
  }, [getActivityTypes]);

  const handleClose = () => {
    closeModal(selected);
  }

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAdd= () => {
    setPreferences(selected)
    closeModal(selected)
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>

      <DialogContent>
      <DialogClose asChild>
            <button
            className="absolute right-4 top-4 text-xl font-bold text-gray-500 hover:text-gray-700"
            aria-label="Fechar"
            onClick={() => closeModal([])}
            >
            X
            </button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Selecione as suas atividades preferidas</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>Selecione as suas atividades preferidas</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <ul className="flex flex-wrap gap-6">
              {activityTypes?.map((activity) => (
                <li key={activity.id}
                    onClick={() => toggleSelection(activity.id)}
                    className={`cursor-pointer rounded  text-sm transition  gap-3`}>
                  <div className="relative flex flex-col items-center justify-center gap-1">
                    <img src={activity.image} alt="" className={`w-24 h-24 object-cover mt-2 rounded-full border-4
                                ${selected.includes(activity.id) ? "border-primary text-white" : "border-white"}`}/>
                    <p>
                        {activity.name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-between space-x-4 mt-4">
          <div className="w-1/2 flex justify-center">
            <Button onClick={handleAdd} size={"sm"}>
                Confirmar
            </Button></div>
          <div className="w-1/2 flex justify-center">
            <Button variant={"outline"} onClick={handleClose} size={"sm"}>
                Pular
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
