import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const optimizeClassName = (inputs) => {
  return twMerge(clsx(inputs));
};

export const getUidFromLocal = () => {
  return localStorage.getItem("uid");
};

export const getDisplayLength = (str) => {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const charUnicode = str.charCodeAt(i);

    if (charUnicode >= 0x4e00 && charUnicode <= 0x9fff) {
      length += 2;
    } else {
      length += 1;
    }
  }
  return length;
};
