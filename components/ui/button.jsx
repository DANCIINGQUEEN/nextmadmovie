import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-gold)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-gold)] text-[var(--color-background)] shadow hover:bg-[var(--color-gold-bright)]",
        destructive:
          "bg-[var(--color-penta)] text-[var(--color-text)] shadow-sm hover:bg-[var(--color-penta)]/80",
        outline:
          "border border-[var(--color-border-bright)] bg-transparent text-[var(--color-text)] shadow-sm hover:bg-[var(--color-surface-2)] hover:border-[var(--color-gold)]",
        secondary:
          "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] shadow-sm hover:bg-[var(--color-border)] hover:text-[var(--color-text)]",
        ghost:
          "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]",
        link:
          "text-[var(--color-gold)] underline-offset-4 hover:underline",
        teal:
          "bg-[var(--color-teal)] text-[var(--color-background)] shadow hover:bg-[var(--color-teal-dim)]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 rounded px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
