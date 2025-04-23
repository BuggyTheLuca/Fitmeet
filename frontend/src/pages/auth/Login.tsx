import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import logo from "../../assets/images/logo-with-text.svg";

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

import useAuth from "@/hooks/useAuth"
import { apiUrl } from "@/consts/api"

const formSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

type FormData = z.infer<typeof formSchema>

function isUserResponse(data: any): boolean {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.token === 'string' &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.email === 'string' &&
    typeof data.cpf === 'string' &&
    typeof data.avatar === 'string' &&
    typeof data.xp === 'number' &&
    typeof data.level === 'number' &&
    Array.isArray(data.achievements)
  );
}

export function Login() {
  const navigate = useNavigate()
  const { setLoggedUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [response, setResponse] = useState<any>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = (data: FormData) => {
    fetch(`${apiUrl}/auth/sign-in`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(async (response) => {
        const responseData = await response.json()
        return { status: response.status, ...responseData }
    })
    .then((data) => {
        if (isUserResponse(data)) {
            setLoggedUser({
                id: data.id,
                name: data.name,
                email: data.email,
                token: data.token,
                avatar: data.avatar,
                level: data.level
            })
            navigate("/home")
        }
        setResponse(data)
    })
  }

  return (
    <div className="max-w-sm mx-auto w-80 flex-col items-center gap-12">
        <div className="flex flex-col items-start gap-2">
            <img src={logo} alt="Vite logo" className="w-30 h-auto"/>
        </div>
        <div className="flex flex-col gap-8 mt-10">
            <div className="flex flex-col gap-6">
                <Form {...form}>
                    <header className="flex flex-col gap-3">
                        <h1 className="text-[32px]">BEM-VINDO DE VOLTA!</h1>
                        <p>Encontre parceiros para treinar ao ar livre. Conecte-se e comece agora! 💪</p>
                    </header>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input placeholder="Digite seu e-mail" {...field} />
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
                                onClick={() => setShowPassword((prev) => !prev)}
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

                    <Button type="submit" className="w-full">Entrar</Button>
                    </form>
                </Form>
                {response?.error && (
                        <p className="text-sm text-red-500">{response.error}</p>
                    )}
            </div>
            <p>Ainda não tem uma conta? <Link to="/register">
              <b>Cadastre-se</b>
            </Link></p>
        </div>
    </div>
  )
}
