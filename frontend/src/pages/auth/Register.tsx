import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
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
import { cpfValidator } from "@/utils/cpf-validator"
import { apiUrl } from "@/consts/api"

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: cpfValidator,
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

type FormData = z.infer<typeof formSchema>

export function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const navigate = useNavigate()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cpf: "",
      email: "",
      password: ""
    }
  })

  const onSubmit = (data: FormData) => {
    fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(async (res) => {
      const resData = await res.json()
      return { status: res.status, ...resData }
    })
    .then((data) => {
      setResponse(data)
      if (data.status === 201)
        navigate("/login")
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
                        <h1 className="text-[32px]">Crie sua conta</h1>
                        <p>Cadastre-se para encontrar parceiros de treino e começar a se exercitar ao ar livre. Vamos juntos! 💪</p>
                    </header>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                <Input placeholder="Digite seu CPF" {...field} />
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

                        <Button type="submit" className="w-full">Cadastrar</Button>
                        {}
                    </form>
                    {response?.error && (
                        <p className="text-sm text-red-500">{response.error}</p>
                    )}
                </Form>
            </div>
            <p>Já tem uma conta? <Link to="/login">
                <b>Faça login</b>
                </Link></p>
        </div>
    </div>
  )
}
