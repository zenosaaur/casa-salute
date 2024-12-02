"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn, convertToISO8601 } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { useMedicationContext } from "@/context/medicationContext"
import { useVisitContext } from "@/context/visitContext"
import { useEffect } from "react"
const FormSchema = z.object({
  dob: z.date({
    required_error: "Necessario inserire una data.",
  }).default(new Date()),
})

export function CalendarForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob: new Date(), // Setting default value
    },
  })
  const { fetchMedicationsByData } = useMedicationContext();
  const { fetchVisitesByDate } = useVisitContext();
  useEffect(() => {
    const oggi = new Date();
    fetchMedicationsByData(convertToISO8601(oggi));
    fetchVisitesByDate(convertToISO8601(oggi));
  }, []);
  function onSubmit(data: z.infer<typeof FormSchema>) {
    fetchMedicationsByData(convertToISO8601(data.dob));
    fetchVisitesByDate(convertToISO8601(data.dob));
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Calendario</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Seleziona una data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    fromDate={new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className="max-w-80">
                Selezionare una data per vedere le prenotazioni di quel giorno
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
