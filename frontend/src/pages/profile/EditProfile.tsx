import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/images/logo-with-text.svg";
import image from "../../assets/images/new-avatar-icon.svg";
import { Trash } from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cpfValidator } from "@/utils/cpf-validator"
import { Preference, UserResponse } from "@/types/user"
import { useUser } from "@/hooks/useUser"
import useAuth from "@/hooks/useAuth"
import { DeleteUser } from "./DeleteUser"
import { useActivity } from "@/hooks/useActivity"
import { ActivityType } from "@/types/activity"

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: cpfValidator,
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  avatar: z.string().min(1, "Selecione uma imagem"),
})

type FormData = z.infer<typeof formSchema>

export function EditProfile() {

    
    const [user, setUser] = useState<UserResponse | null>(null);
    
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isModalOpen, setModal] = useState<boolean>(false);
  
  const [preferences, setPreferencesState] = useState<string[]>([]);
  const [activityTypes, setActivityTypes] = useState<ActivityType[] | null>(null);
  const { setLoggedUser, loggedUser } = useAuth()
  
  const {getActivityTypes} = useActivity()
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const navigate = useNavigate()
  const { getUser, updateAvatar, updateUser, setPreferences, getPreferences } = useUser()

    useEffect(() => {
        getUser()?.then((data) => {
            if (data) setUser(data.user);
        });
    },[getUser])

    useEffect(() => {
        getActivityTypes()?.then((data) => {
            if(data)
            setActivityTypes(data.activityTypes);
        });
    }, [getActivityTypes]);

    useEffect(() => {
        getPreferences()?.then((data) => {
          if(data){
            setPreferencesState(data.preferences.map((type) => type.typeId));
          }
        });
      }, [getPreferences]);

  useEffect(() => {
    if(!user) return;

    form.setValue("name", user.name)
    form.setValue("cpf", user.cpf)
    form.setValue("email", user.email)
    form.setValue('avatar', user.avatar)
    
    setImagePreview(user.avatar)
  }, [user])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cpf: "",
      email: "",
      password: ""
    }
  })

  const toggleSelection = (id: string) => {
    setPreferencesState((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const closeModal = () => {
    setModal(false);
  };

  const onSubmit = async (data: FormData) => {
    const avatarForm = new FormData();
    const userForm = new FormData();
    
    userForm.append("name", data.name);
    userForm.append("email", data.email);
    userForm.append("password", data.password);
    let avatarResponse;
    if(imageFile){
        avatarForm.append("avatar", imageFile);
        avatarResponse = await updateAvatar(avatarForm)
    }

    await setPreferences(preferences)

    const userResponse = await updateUser(userForm)

    if(userResponse?.status == 200 && (!imageFile || avatarResponse?.status == 200)){
        if(loggedUser)
            setLoggedUser({
                id: userResponse.user.id,
                name: userResponse.user.name,
                email: userResponse.user.email,
                token: loggedUser.token,
                avatar: userResponse.user.avatar,
                level: userResponse.user.level
            })
            
        navigate('/profile')
    }
  }

  return (
    <div className="max-w-sm mx-auto w-80 flex-col items-center gap-12">
        {isModalOpen && <DeleteUser closeModal={closeModal}/>}
        <div className="flex flex-col items-start gap-2">
            <img src={logo} alt="Vite logo" className="w-30 h-auto"/>
        </div>
        <div className="flex flex-col gap-8 mt-10">
            <div className="flex flex-col gap-6">
                <Form {...form}>
                    <div className="flex justify-start">
                        <Button variant={'link'} onClick={() => navigate('/profile')}> &lt; Voltar para o perfil</Button>
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <div className="flex w-[197px] h-[197px] rounded-full mx-auto items-center justify-center">
                                <input type="file"
                                    accept="image/png, image/jpeg"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          setImageFile(file);
                                          
                                          // Revoga o objeto anterior (evita vazamento de memória)
                                          if (imagePreview) {
                                            URL.revokeObjectURL(imagePreview);
                                          }
                                      
                                          const previewUrl = URL.createObjectURL(file);
                                          setImagePreview(previewUrl);
                                          field.onChange(file.name);
                                        }
                                      }}
                                    id="image"/>
                                <div className="flex w-[196px] h-[196px] rounded-full mx-auto items-center justify-center overflow-hidden relative"
                                    onClick={() => fileInputRef.current?.click()}>
                                    <img src={imagePreview!}
                                        alt="Preview"
                                        className={'min-w-full min-h-full w-full h-full'}/>
                                    <div className="absolute top-33 right-8">
                                        <img src={image} alt="" className="cursor-pointer"/>
                                    </div>
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}/>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                <Input placeholder="Digite seu nome" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cpf"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>CPF</FormLabel>
                                <FormControl>
                                <Input disabled={true} placeholder="Digite seu CPF" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input type="email" placeholder="Digite seu e-mail" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    {...field}
                                    />
                                    <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-2 top-2.5 text-muted-foreground"
                                    >
                                    {showPassword ? (
                                        <EyeOffIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" />
                                    )}
                                    </button>
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="max-w-full">
                            <ul className="flex gap-6 overflow-x-auto">
                                {activityTypes?.map((activity) => (
                                <li key={activity.id}
                                    onClick={() => toggleSelection(activity.id)}
                                    className={`cursor-pointer rounded  text-sm transition  gap-3`}>
                                <div className="relative flex flex-col items-center justify-center gap-1">
                                    <img src={activity.image} alt="" className={`w-24 h-24 min-w-24 min-h-24 object-cover mt-2 rounded-full border-4
                                                ${preferences.includes(activity.id) ? "border-primary text-white" : "border-white"}`}/>
                                    <p>
                                        {activity.name}
                                    </p>
                                </div>
                                </li>
                            ))}
                            </ul>
                        </div>
                        <div className="flex justify-around">
                            <Button disabled={!user} type="submit" className="w-[48%]">Editar</Button>
                            <Button variant={'outline'} className="w-[48%]">cancelar</Button>
                        </div>
                    </form>
                    {response?.error && (
                        <p className="text-sm text-red-500">{response.error}</p>
                    )}
                </Form>
            </div>
            <div className="flex w-full justify-center">
                <Button variant={'delete'} className="flex justify-between" size={'sm'} onClick={() => setModal(true)}><Trash size={24} color="red"/>Desativar minha conta</Button>
            </div>
        </div>
    </div>
  )
}
