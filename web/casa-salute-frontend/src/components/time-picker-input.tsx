"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, convertToISO8601, formatDataUSA } from "@/lib/utils";
import React, { useEffect } from "react";
import {
  TimePickerType,
  getArrowByType,
  getDateByType,
  setDateByType,
} from "@/lib/time-picker-utils";
import useVisit from "@/hooks/useVisit";
import { format } from "date-fns";

export interface TimePickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: TimePickerType;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
  ambulatorio: string | undefined
}

const TimePickerInput = React.forwardRef<
  HTMLInputElement,
  TimePickerInputProps
>(
  (
    {
      className,
      type = "tel",
      value,
      id,
      name,
      date = new Date(new Date().setHours(8, 0, 0, 0)),
      setDate,
      onChange,
      onKeyDown,
      picker,
      onLeftFocus,
      onRightFocus,
      ambulatorio,
      ...props
    },
    ref
  ) => {
    const [flag, setFlag] = React.useState<boolean>(false);

    const { availableTimesInAmbulatorio, fetchVisitTimesByAmbulatorio } = useVisit()

    const fetchData = async () => {
      if (ambulatorio)
        await fetchVisitTimesByAmbulatorio(formatDataUSA(date), ambulatorio)
    }
    /**
     * allow the user to enter the second digit within 2 seconds
     * otherwise start again with entering first digit
     */
    React.useEffect(() => {
      fetchData()
      if (flag) {
        const timer = setTimeout(() => {
          setFlag(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [flag]);

    const calculatedValue = React.useMemo(
      () => getDateByType(date, picker),
      [date, picker]
    );

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //   if (e.key === "Tab") return;
    //   e.preventDefault();
    //   if (e.key === "ArrowRight") onRightFocus?.();
    //   if (e.key === "ArrowLeft") onLeftFocus?.();
    //   if (["ArrowUp", "ArrowDown"].includes(e.key)) {
    //     const step = e.key === "ArrowUp" ? 1 : -1;
    //     const newValue = getArrowByType(calculatedValue, step, picker);
    //     if (flag) setFlag(false);
    //     const tempDate = new Date(date);
    //     setDate(setDateByType(tempDate, newValue, picker));
    //   }
    //   if (e.key >= "0" && e.key <= "9") {
    //     const newValue = !flag
    //       ? "0" + e.key
    //       : calculatedValue.slice(1, 2) + e.key;
    //     if (flag) onRightFocus?.();
    //     setFlag((prev) => !prev);
    //     const tempDate = new Date(date);
    //     setDate(setDateByType(tempDate, newValue, picker));
    //   }
    // };


    const timeOptions = [];
    if (picker == 'hours') {
      for (let hour = 8; hour <= 16; hour++) {
        timeOptions.push(`${hour}`);
      }
    } else {
      for (let minute = 0; minute <= 1; minute++) {
        timeOptions.push(`${minute * 30}`);
      }
    }


    const handleSelectChange = (value: string) => {
      const newDate = new Date(date);
      if (picker == 'hours')
        newDate.setHours(Number(value), date.getMinutes(), 0, 0);
      else
        newDate.setHours(date.getHours(), Number(value), 0, 0);
      setDate(newDate);
    };

    return (
      <div className={cn("time-picker-input", className)}>
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Times</SelectLabel>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          ref={ref}
          id={id || picker}
          name={name || picker}
          className={cn(
            "w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none",
            className
          )}
          value={value || calculatedValue}
          onChange={(e) => {
            e.preventDefault();
            onChange?.(e);
          }}
          type={type}
          inputMode="decimal"
          // onKeyDown={(e) => {
          //   onKeyDown?.(e);
          //   handleKeyDown(e);
          // }}
          {...props}
        />
      </div>
    );
  }
);

TimePickerInput.displayName = "TimePickerInput";

export { TimePickerInput };
