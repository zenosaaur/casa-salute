"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import axios from "axios"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email({
    message: "email non valida"
  }),
  password: z.string({ required_error: "Password obbligatoria" })
})

export function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const { login } = useAuth();
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {

    axios.post('http://127.0.0.1:5000/login', { password: values.password, email: values.email })
      .then(response => {
        login({ ...response.data, expire: Date.now() + 18000000 });
      })
      .catch(error => {
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Errore credenziali"
        })

        console.error('Si è verificato un errore:', error);
      });
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="latua@email.con" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  )
}
