import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[var(--color-gold-dim)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]",
        secondary:
          "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-muted)]",
        destructive:
          "border-[var(--color-penta)]/30 bg-[var(--color-penta)]/10 text-[var(--color-penta)]",
        teal:
          "border-[var(--color-teal)]/30 bg-[var(--color-teal)]/10 text-[var(--color-teal)]",
        outline:
          "border-[var(--color-border-bright)] text-[var(--color-text-muted)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
