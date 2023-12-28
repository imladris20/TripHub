import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { optimizeClassName } from "../utils/util";

const buttonVariants = cva("w-20 rounded font-bold text-black", {
  variants: {
    variant: {
      default: "bg-green-100",
      active: "bg-emerald-400",
    },
    size: {
      default: "h-6 px-2 py-1 text-xs",
      lg: "h-10 px-4 py-2 text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const MyButton = forwardRef(({ className, size, variant, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={optimizeClassName(
        buttonVariants({ variant, size, className }),
      )}
      {...props}
    />
  );
});

export default MyButton;
