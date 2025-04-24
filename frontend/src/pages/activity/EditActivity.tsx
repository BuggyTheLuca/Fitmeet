import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { ActivityResponse, ActivityType } from "@/types/activity";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/hooks/useActivity";
import { Input } from "@/components/ui/input";
import image from "../../assets/images/without-image.svg";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import MapClickMarker from "@/components/common/MapClickMarker";
import { DialogClose } from "@radix-ui/react-dialog";

const formSchema = z.object({
  image: z.string().min(1, "Selecione uma imagem"),
  typeId: z.string().min(1, "Selecione um tipo de atividade"),
  title: z.string().min(1, "Título em branco"),
  description: z.string().min(1, "Descrição em branco"),
  date: z.string(),
  address: z.string().min(1, 'Selecione um ponto de encontro'),
  private: z.any()
});

type FormData = z.infer<typeof formSchema>;

export function EditActivity({ activity, closeModal }: {activity: ActivityResponse, closeModal: (isCancelled: boolean, updatedActivity?: ActivityResponse) => void }) {
  const [activityTypes, setActivityTypes] = useState<ActivityType[] | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [isPrivate, setPrivate] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getActivityTypes, updateActivity, deleteActivity } = useActivity();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: '',
      typeId: '',
      title: '',
      description: '',
      date: '',
      address: ''
    },
  });

  useEffect(() => {
    form.setValue("image", activity.image)
    form.setValue("title", activity.title)
    form.setValue("description", activity.description)
    form.setValue("date", new Date(activity.scheduledDate).toISOString().slice(0, 16))
    form.setValue("address", JSON.stringify(activity.address))
    if(activityTypes){
        const activityTypeId = activityTypes.find((type) => type.name == activity.type)?.id
        form.setValue('typeId', activityTypeId!)
        setSelectedActivity(activityTypeId!)
    }
    setPrivate(activity.private)
    setImagePreview(activity.image)
  }, [activityTypes])

  useEffect(() => {
    getActivityTypes()?.then((data) => {
      if (data) setActivityTypes(data.activityTypes);
    });
  }, [getActivityTypes]);

  const handleAdd = async (data: FormData) => {
    const formData = new FormData();
    if(imageFile){
        formData.append("image", imageFile);
    }
    formData.append("typeId", data.typeId);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("scheduledDate", new Date(data.date).toISOString());
    formData.append("address", data.address)
    formData.append("private", data.private ? "true" : "false")
    await updateActivity(formData, activity.id).then((res) => {
      if(res?.status == 200)
        closeModal(false, res.activity);
    })
  };

  const handleCancel = async () => {
    await deleteActivity(activity.id).then((res) => {
      if(res?.status == 200)
        closeModal(true);
    })
  }

  return (
    <Dialog open={true} onOpenChange={() => { }}>

      <DialogContent size="lg">
      <DialogClose asChild>
            <button
            className="absolute right-4 top-4 text-xl font-bold text-gray-500 hover:text-gray-700"
            aria-label="Fechar"
            onClick={() => closeModal(false)}
            >
            X
            </button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Editar atividade</DialogTitle>
          <DialogDescription>Editar atividade</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
            <div className="space-y-4 flex justify-between gap-x-12">
                <div className="flex flex-col gap-10">
                    <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                        <FormItem>
                        <FormLabel>Imagem</FormLabel>
                        <FormControl>
                            <div className="flex w-87 h-35 rounded mx-auto items-center justify-center border border-3 border-grey">
                                <input type="file"
                                    accept="image/png, image/jpeg"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setImageFile(file);
                                        setImagePreview(URL.createObjectURL(file));
                                        field.onChange(file.name); // só o nome, pra evitar o erro
                                    }
                                    }}
                                    id="image"/>
                                <div className="flex w-auto h-auto rounded mx-auto items-center justify-center cursor-pointer overflow-hidden"
                                    onClick={() => fileInputRef.current?.click()}>
                                    <img src={imagePreview ?? image}
                                        alt="Preview"
                                        className={` ${imagePreview ? 'w-87 h-35' : 'w-full h-full'}`}/>
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}/>

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                            <Input placeholder="Ex: futebol de domingo" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                            <Textarea className="min-h-[150px] resize-y" placeholder="Como será a atividade? Quais as regras? O que é necessário para participar?" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data</FormLabel>
                            <FormControl>
                            <Input {...field}
                                type="datetime-local"
                                id="datetime"
                                className="w-full justify-end"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>

                </div>

                <div className="flex max-w-full flex-col gap-10">
                    <FormField
                        control={form.control}
                        name="typeId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tipo de Atividade</FormLabel>
                            <FormControl>
                                <div className="max-w-full overflow-x-auto">
                                <ul className="flex gap-6 w-max px-4 py-2">
                                    {activityTypes?.map((activity) => (
                                    <li
                                        key={activity.id}
                                        onClick={() => {
                                        form.setValue("typeId", activity.id);
                                        setSelectedActivity(activity.id);
                                        }}
                                        className={`cursor-pointer rounded text-sm transition min-w-[100px] gap-3 ${
                                            selectedActivity === activity.id ? 'bg-gray-100' : ''}`}>
                                        <div className="flex flex-col items-center justify-center gap-1">
                                        <img
                                            src={activity.image}
                                            alt={activity.name}
                                            className={`w-24 h-24 object-cover mt-2 rounded-full border-4 ${selectedActivity === activity.id ? "border-primary" : "border-white"}`}
                                        />
                                        <p className="text-center">{activity.name}</p>
                                        </div>
                                    </li>
                                    ))}
                                </ul>
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ponto de encontro</FormLabel>
                            <FormControl>
                            <MapClickMarker center={activity.address} setLocal={(latitude: number, longitude: number) => {
                                form.setValue("address", JSON.stringify({latitude, longitude}));
                                }}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>

                    <FormField
                        control={form.control}
                        name="private"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Requer aprovação para participar?</FormLabel>
                            <FormControl>
                            <div className="w-full flex justify-start gap-2">
                                <Button type="button" variant={isPrivate ? 'selected': 'unselected'}
                                    onClick={() => {
                                        form.setValue("private", true);
                                        setPrivate(true);
                                        }}>Sim
                                </Button>
                                <Button type="button" variant={!isPrivate ? 'selected': 'unselected'}
                                    onClick={() => {
                                        form.setValue("private", false);
                                        setPrivate(false);
                                        }}>Não
                                </Button>
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                        
                </div>
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              <div className="flex justify-center">
                <Button type="button" variant={'danger'} onClick={handleCancel} size="sm">
                  cancelar
                </Button>
              </div>
              <div className="flex justify-center">
                <Button type="submit" size="sm">
                  Confirmar
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
