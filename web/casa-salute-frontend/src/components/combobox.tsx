
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { ZodSchema, z } from "zod"
import { useController, useFormContext, } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ComboValue } from "@/lib/form-schema"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CommandList } from "cmdk"

interface formProps {
  formSchema: ZodSchema,
  name: string,
  comboValues: ComboValue[]
}

export function ComboboxDemo({ formSchema, name, comboValues }: formProps) {
  const [open, setOpen] = React.useState(false)
  const { control, formState: { errors }, setValue, getValues } = useFormContext<z.infer<typeof formSchema>>();
  const { field } = useController({
    name,
    control
  })
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {
            field.value ? comboValues.find((comboValues) => comboValues.value === field.value)?.label
              : "Selezione un dorttore..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Ricerca..." />
          <CommandList />
          <CommandEmpty>Nessuna ricorrenza</CommandEmpty>
          <CommandGroup>
            {comboValues.map((value) => (
              <CommandItem
                key={value.value}
                value={value.value}
                onSelect={(currentValue) => {
                  setValue("id_dottore", currentValue === value.value ? currentValue : "")
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    field.value === value.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {value.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
