/* eslint-disable no-unused-vars */
import { Chat, CheckCircle, Trash, User } from "phosphor-react";
import { ReactNode } from "react";

enum QuestionColor {
  default = "bg-gray-100 border border-gray-100",
  selected = "bg-gray-200 border border-purple-300",
  answered = "bg-gray-500 border border-gray-500",
}

export interface QuestionProps {
  id: number;
  state?: "default" | "selected" | "answered";
  children: ReactNode;
  author: {
    avatar?: string | null;
    name: string;
  };
  likes?: number;
  onSelect: () => void;
  onFinish: () => void;
  onDelete: () => void;
}

export function Question({
  onSelect,
  onFinish,
  onDelete,
  state = "default",
  author,
  likes = 0,
  children,
}: QuestionProps) {
  return (
    <div
      className={`p-6 rounded-lg shadow-sm flex flex-col gap-6 
        ${QuestionColor[state]}
      `}
    >
      <p className="leading-relaxed">{children}</p>
      <footer className="flex justify-between">
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-2">
            <span className="bg-purple-300 rounded-full w-8 h-8 overflow-hidden flex justify-center items-center">
              {author.avatar ? (
                <img src={author.avatar} alt="" />
              ) : (
                <User color="#fff" size={18} />
              )}
            </span>
            <p>{author.name}</p>
          </span>
        </div>

        <div className="flex gap-4 items-center">
          <span className="flex gap-2 items-center">{likes} curtidas </span>
          <p className="text-gray-500">|</p>
          <CheckCircle
            size={24}
            color={state === "answered" ? "#835AFD" : "#737380"}
            className="cursor-pointer hover:opacity-70 transition-opacity"
            onClick={onFinish}
          />
          <Chat
            size={24}
            color={state === "selected" ? "#835AFD" : "#737380"}
            className="cursor-pointer hover:opacity-70 transition-opacity"
            onClick={onSelect}
          />
          <Trash
            size={24}
            color="#E73F5D"
            onClick={onDelete}
            className="cursor-pointer hover:opacity-70 transition-opacity"
          />
        </div>
      </footer>
    </div>
  );
}
