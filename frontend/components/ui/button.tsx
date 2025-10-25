import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-neoBlue focus-visible:ring-neoBlue/50 focus-visible:ring-[3px] dark:focus-visible:border-neoCyan dark:focus-visible:ring-neoCyan/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transform hover:-translate-y-1 hover:scale-105 duration-300",
  {
    variants: {
      variant: {
        default:
          'bg-neoBlue text-neoLight shadow-[4px_4px_0_0_#232323] hover:shadow-[2px_2px_0_0_#232323] dark:bg-neoCyan dark:text-neoDark dark:shadow-[4px_4px_0_0_#FF00FF] dark:hover:shadow-[2px_2px_0_0_#FF00FF]',
        destructive:
          'bg-neoMagenta text-neoLight shadow-[4px_4px_0_0_#007BFF] hover:bg-neoMagenta/90 dark:bg-neoMustard dark:text-neoDark dark:shadow-[4px_4px_0_0_#00FFFF] dark:hover:bg-neoMustard/90 focus-visible:ring-neoMagenta/20 dark:focus-visible:ring-neoMustard/40',
        outline:
          'border-4 border-neoDark text-neoDark bg-transparent shadow-[4px_4px_0_0_#FFDB58] hover:bg-neoDark hover:text-neoLight dark:border-neoCyan dark:text-neoLight dark:shadow-[4px_4px_0_0_#007BFF] dark:hover:bg-neoCyan dark:hover:text-neoDark',
        secondary:
          'bg-neoMustard text-neoDark shadow-[4px_4px_0_0_#007BFF] hover:bg-neoMustard/90 dark:bg-neoMagenta dark:text-neoLight dark:shadow-[4px_4px_0_0_#00FFFF] dark:hover:bg-neoMagenta/90',
        ghost:
          'hover:bg-neoLight/20 hover:text-neoBlue dark:hover:bg-neoDark/20 dark:hover:text-neoCyan',
        link:
          'text-neoBlue underline-offset-4 hover:underline dark:text-neoCyan',
      },
      size: {
        default: 'h-11 px-6 py-2 has-[>svg]:px-4',
        sm: 'h-9 px-4 gap-1.5 has-[>svg]:px-3',
        lg: 'h-12 px-8 has-[>svg]:px-6',
        icon: 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
