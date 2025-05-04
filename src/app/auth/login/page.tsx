"use client";

import Header from "@/components/header";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import axios from "axios";

const loginSchema = z.object({
  email: z.string().email({
    message: "Insira um e-mail válido",
  }),
  senha: z.string().min(4, {
    message: "A senha possui no mínimo 4 caracteres",
  }),
});

export default function Login() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        values
      );

      if (response.status === 200) {
        toast("Login concluído com sucesso", {
          description: "Acesse a página de boas-vindas!",
          style: {
            background: "#22c55e",
            color: "#fff",
          },
          action: {
            label: "Acessar página",
            onClick: () => router.push("/home"),
          },
        });
      } else {
        toast.error("Erro ao realizar login");
      }
    } catch (error) {
      toast.error("Erro ao realizar login");
      console.error("Erro de login:", error);
    }
  }

  return (
    <div>
      <Header title="Página de login" />
      <div className="flex items-center justify-center min-h-screen">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu e-mail" {...field} />
                  </FormControl>
                  <FormDescription>
                    Cadastre-se para fazer o login
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite a sua senha"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Entrar</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
