import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

interface ModalProps {
  trigger: ReactNode;
  title: ReactNode;
  description: ReactNode;
  content: ReactNode;
}

export function Modal({ trigger, title, description, content }: ModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Overlay className="bg-gray-900 bg-opacity-70 backdrop-blur-sm fixed top-0 bottom-0 left-0 right-0 grid place-items-center">
        <Dialog.Content className="flex flex-col items-center w-max bg-gray-100 px-32 py-16 rounded-lg shadow-lg">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description className="text-gray-400">
            {description}
          </Dialog.Description>

          {content}
        </Dialog.Content>
      </Dialog.Overlay>
      <Dialog.Close />
    </Dialog.Root>
  );
}
