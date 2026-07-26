import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-black text-white hover:bg-neutral-800",

        secondary:
          "bg-[#3E4D3A] text-white hover:bg-[#334030]",

        outline:
          "border border-neutral-300 bg-transparent hover:bg-neutral-100",

        ghost:
          "hover:bg-neutral-100",

        luxury:
          "bg-[#C8A96A] text-white hover:brightness-95",
      },

      size: {
        sm: "h-9 px-4 text-sm",

        md: "h-11 px-6 text-base",

        lg: "h-14 px-8 text-lg",

        icon: "h-11 w-11",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    />
  );
}