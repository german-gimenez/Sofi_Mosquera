import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gris-nav disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-negro text-brand-blanco-calido hover:bg-brand-negro-suave rounded-[8px]",
        secondary:
          "bg-transparent text-brand-negro border-b border-brand-negro hover:opacity-70 rounded-none px-0 pb-0.5",
        outline:
          "border border-brand-gris-border text-brand-negro hover:bg-brand-crema rounded-[8px]",
      },
      size: {
        default: "px-6 py-3.5 text-[15px]",
        sm: "px-4 py-2 text-sm",
        lg: "px-8 py-4 text-base",
        full: "w-full px-6 py-3.5 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
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
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
