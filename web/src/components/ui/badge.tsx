import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/85 dark:shadow-[0_12px_24px_-18px_hsl(var(--primary)/0.86)]",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/85 dark:bg-secondary/82",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/85 dark:shadow-[0_12px_24px_-18px_hsl(var(--destructive)/0.8)]",
        outline: "border-border/80 bg-background/72 text-foreground dark:border-white/[0.08] dark:bg-background/45",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge }
