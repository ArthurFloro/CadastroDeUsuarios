"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  nome: z.string().min(2, {
    message: "O usuário deve ter no mínimo 2 caracteres",
  }),
  email: z.string().email({
    message: "Digite um email válido",
  }),
  senha: z.string().min(4, {
    message: "A senha precisa ter no mínimo 4 caracteres",
  }),
});

export default function Register() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar o usuário");
      }

      toast("Usuário cadastrado com sucesso", {
        description: "Fazer login para a verificação",
        style: {
          background: "#22c55e",
          color: "#fff",
        },
        action: {
          label: "Logar",
          onClick: () => router.push("/auth/login"),
        },
      });

      form.reset();
    } catch (error: unknown) {
      let message = "Ocorreu um erro";

      if (error instanceof Error) {
        message = error.message;
      }

      toast("Erro no cadastro", {
        description: message,
        style: {
          background: "#ef4444",
          color: "#FFF",
        },
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do usuário</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o seu nome" {...field} />
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
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu e-mail" {...field} />
                </FormControl>

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

                <FormDescription>
                  Cadastre-se para fazer o login
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Cadastrar</Button>
        </form>
      </Form>
    </div>
  );
}
