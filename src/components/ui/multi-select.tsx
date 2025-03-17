"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronDown, XIcon, WandSparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export interface Option {
  value: string;
  label: string;
}

const MultiSelectVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-background hover:bg-accent hover:text-muted-foreground h-9 px-4 py-2",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent hover:text-secondary-foreground h-9 px-4 py-2",
        outline: "border border-input bg-background hover:bg-accent hover:text-muted-foreground h-9 px-4 py-2",
        ghost: "hover:bg-accent hover:text-muted-foreground h-9 px-4 py-2",
        link: "text-primary underline-offset-4 hover:underline h-9",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface MultiSelectProps extends React.HTMLAttributes<HTMLButtonElement> {
  options: Option[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  variant?: VariantProps<typeof MultiSelectVariants>["variant"];
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<string[]>(defaultValue);

    const handleSelect = (item: string) => {
      const newValue = value.includes(item)
        ? value.filter((val) => val !== item)
        : [...value, item];

      setValue(newValue);
      onValueChange(newValue); // Pass the updated array of strings
    };

    const handleClear = () => {
      setValue([]);
      onValueChange([]);
    };

    React.useEffect(() => {
      setValue(defaultValue);
    }, [defaultValue]);

    const selectedOptions = options.filter((option) => value.includes(option.value));

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild={asChild}>
          <Button
            variant={variant}
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", value.length > 0 && "border-none", className)}
            ref={ref}
            {...props}
          >
            {value.length > 0 ? (
              <>
                <div className="flex w-full flex-wrap gap-1">
                  {selectedOptions.slice(0, maxCount).map((item) => (
                    <Badge key={item.value} variant="secondary" className="gap-x-1">
                      {item.label}
                      <XIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(item.value);
                        }}
                        className="h-3 w-3 cursor-pointer"
                      />
                    </Badge>
                  ))}
                  {selectedOptions.length > maxCount && (
                    <Badge variant="secondary">+{selectedOptions.length - maxCount}</Badge>
                  )}
                </div>
              </>
            ) : (
              placeholder
            )}
            {!modalPopover && <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search options..." />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              {value.length > 0 && (
                <>
                  <div className="flex items-center justify-between px-2 py-1">
                    <p className="text-sm text-muted-foreground">
                      {selectedOptions.length} option
                      {selectedOptions.length > 1 ? "s" : null} selected
                    </p>
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                      <WandSparkles className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                  <Separator />
                </>
              )}
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      handleSelect(option.value);
                      setOpen(true);
                    }}
                  >
                    <CheckIcon
                      className={cn("mr-2 h-4 w-4", value.includes(option.value) ? "opacity-100" : "opacity-0")}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";