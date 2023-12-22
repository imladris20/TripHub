import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const optimizeClassName = (inputs) => {
  return twMerge(clsx(inputs));
};
