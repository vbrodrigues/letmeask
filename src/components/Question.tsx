/* eslint-disable no-unused-vars */
import { Chat, CheckCircle, ThumbsUp, Trash, User } from "phosphor-react";
import { ReactNode, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { SolidButton } from "./SolidButton";
import { Modal } from "./Modal";

enum QuestionColor {
  default = "bg-gray-100 border border-gray-100",
  selected = "bg-gray-200 border border-purple-300",
  answered = "bg-gray-500 border border-gray-500",
}

export interface QuestionProps {
  id: string;
  state?: "default" | "selected" | "answered";
  children: ReactNode;
  author: {
    avatar?: string | null;
    name: string;
  };
  initialLikes?: number;
  type?: "admin" | "user";
  onSelect: () => void;
  onFinish: () => void;
  onDelete: () => void;
  onLike: () => void;
}

export function Question({
  onSelect,
  onFinish,
  onDelete,
  onLike,
  state = "default",
  author,
  initialLikes = 0,
  type = "admin",
  children,
}: QuestionProps) {
  const [likes, setLikes] = useState<number>(initialLikes);

  async function handleLike() {
    setLikes((state) => state + 1);
    await onLike();
  }

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

        {type === "admin" ? (
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

            <Modal
              trigger={
                <Trash
                  size={24}
                  color="#E73F5D"
                  onClick={() => {}}
                  className="cursor-pointer hover:opacity-70 transition-opacity"
                />
              }
              title={
                <div className="flex flex-col gap-6 mb-3 items-center">
                  <Trash size={48} color="#E73F5D" />
                  <strong className="text-2xl font-title">
                    Excluir pergunta
                  </strong>
                </div>
              }
              description="Tem certeza que você deseja excluir esta pergunta?"
              content={
                <div className="flex gap-4 mt-10">
                  <Dialog.Close>
                    <SolidButton color="grayed" text="Cancelar" size="medium" />
                  </Dialog.Close>
                  <Dialog.Close>
                    <SolidButton
                      color="danger"
                      text="Sim, excluir"
                      size="medium"
                      onClick={onDelete}
                    />
                  </Dialog.Close>
                </div>
              }
            />
          </div>
        ) : (
          <div className="flex gap-2 items-start">
            <span className="flex gap-2 items-center text-gray-700 text-lg">
              {likes}
            </span>
            <ThumbsUp
              size={24}
              color={state === "selected" ? "#835AFD" : "#737380"}
              className="cursor-pointer hover:opacity-70 transition-opacity"
              onClick={handleLike}
            />
          </div>
        )}
      </footer>
    </div>
  );
}
