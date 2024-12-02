import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

// Utility function for classNames
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

const RadioGroup: React.ForwardRefRenderFunction<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
> = ({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
};

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem: React.ForwardRefRenderFunction<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
> = ({ className, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(false);

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
        isChecked ? "bg-black" : "bg-white"
      )}
      {...props}
      onClick={() => setIsChecked(!isChecked)}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        {isChecked && <Circle className="h-2.5 w-2.5 fill-current text-white" />}
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
};

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
