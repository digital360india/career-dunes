"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const VARIANT_CLASSES = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  highlight: "bg-highlight text-highlight-foreground shadow hover:bg-highlight-strong",
  heroOutline:
    "border border-primary-foreground/60 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20",
  secondaryOutline:
    "border border-secondary-foreground/60 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10",
  warning: "bg-warning-foreground text-warning hover:bg-warning-foreground/90",
  nav: "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20",
  destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline:
    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const SIZE_CLASSES = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  xl: "h-13 rounded-md px-7 text-base",
  icon: "h-9 w-9",
};

function buttonVariants({ variant = "default", size = "default", className } = {}) {
  return cn(
    BASE_CLASSES,
    VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.default,
    SIZE_CLASSES[size] ?? SIZE_CLASSES.default,
    className
  );
}

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = "button";

    return (
      <Comp
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };