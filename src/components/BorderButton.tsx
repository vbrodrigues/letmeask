/* eslint-disable no-unused-vars */
import { ButtonHTMLAttributes, ReactElement } from "react";

enum BorderButtonSize {
  small = "w-30 h-10 px-6 py-2",
  medium = "w-40 px-8 py-4",
  big = "w-80 px-10 py-4",
}

enum BorderButtonColor {
  main = "border border-purple-300 text-purple-300",
  danger = "bg-red-300 text-gray-100",
  grayed = "bg-gray-300 text-gray-700",
}

interface BorderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  color: "main" | "danger" | "grayed";
  icon?: ReactElement;
  size?: "small" | "medium" | "big";
}

export function BorderButton({
  text,
  icon = undefined,
  color,
  size = "big",
  ...rest
}: BorderButtonProps) {
  return (
    <button
      {...rest}
      className={`flex gap-2 font-medium justify-center items-center rounded-lg hover:brightness-75 transition-all 
      ${BorderButtonColor[color]}
      ${BorderButtonSize[size]} `}
    >
      {icon && icon}
      <span>{text}</span>
    </button>
  );
}
