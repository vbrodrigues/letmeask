/* eslint-disable no-unused-vars */
import { ButtonHTMLAttributes, ReactElement } from "react";

enum SolidButtonSize {
  small = "w-30 px-6 py-2",
  medium = "w-40 px-8 py-4",
  big = "w-80 px-10 py-4",
}

enum SolidButtonColor {
  main = "bg-purple-300 text-gray-100",
  danger = "bg-red-300 text-gray-100",
  grayed = "bg-gray-500 text-gray-700",
}

interface SolidButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  color: "main" | "danger" | "grayed";
  icon?: ReactElement;
  size?: "small" | "medium" | "big";
}

export function SolidButton({
  text,
  icon = undefined,
  color,
  size = "big",
  ...rest
}: SolidButtonProps) {
  return (
    <button
      {...rest}
      className={`flex gap-2 font-medium justify-center items-center rounded-lg hover:brightness-90 transition-all 
      ${SolidButtonColor[color]}
      ${SolidButtonSize[size]} `}
    >
      {icon && icon}
      <span>{text}</span>
    </button>
  );
}
