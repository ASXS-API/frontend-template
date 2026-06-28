import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/92 dark:shadow-[0_14px_28px_-18px_hsl(var(--primary)/0.82)] dark:hover:shadow-[0_18px_32px_-18px_hsl(var(--primary)/0.9)]',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/92 dark:shadow-[0_14px_28px_-18px_hsl(var(--destructive)/0.72)]',
        outline:
          'border border-input bg-background/85 shadow-sm hover:border-accent-foreground/10 hover:bg-accent hover:text-accent-foreground dark:border-white/[0.08] dark:bg-background/60 dark:hover:border-primary/20 dark:hover:bg-accent/85',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/85 dark:bg-secondary/82 dark:hover:bg-secondary',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/85',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
