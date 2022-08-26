import { createContext, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  database,
  ref,
  query,
  equalTo,
  orderByChild,
  onValue,
  limitToFirst,
  push,
  child,
  get,
  update,
  remove,
} from "../services/firebase";

interface Author {
  id: string;
  name: string;
  avatar?: string;
}

export interface Question {
  id: string;
  content: string;
  author: Author;
  likes: number;
  createdAt: string;
}

export interface Room {
  id: string;
  title: string;
  authorId?: string;
  number: number;
  isActive: boolean;
  questions: Question[];
  createdAt: string;
}

interface RoomsContextProps {
  createRoom: (roomName: string) => Promise<string | null>;
  closeRoom: (roomId: string) => Promise<void>;
  getRoomById: (roomId: string) => Promise<Room | undefined>;
  getRoomByNumber: (
    roomNumber: string,
    callback: (roomData: Room) => void
  ) => Promise<void>;
  addQuestionToRoom: (roomId: string, question: Question) => Promise<void>;
  removeQuestionFromRoom: (roomId: string, questionId: string) => Promise<void>;
  incrementQuestionLikes: (roomId: string, questionId: string) => Promise<void>;
}

export const RoomsContext = createContext({} as RoomsContextProps);

interface RoomsContextProviderProps {
  children: ReactNode;
}

export function RoomsContextProvider({ children }: RoomsContextProviderProps) {
  const { user } = useAuth();

  async function createRoom(roomName: string): Promise<string | null> {
    const roomNumber = Math.floor(Math.random() * 899999 + 100000);

    const roomData = {
      title: roomName,
      authorId: user?.id,
      number: roomNumber,
      isActive: true,
      questions: {},
      createdAt: new Date().toISOString(),
    };
    const roomId = await push(child(ref(database), "rooms"), roomData).key;

    return roomId;
  }

  async function closeRoom(roomId: string): Promise<void> {
    await update(ref(database, `rooms/${roomId}`), { isActive: false });
  }

  async function getRoomById(roomId: string): Promise<Room | undefined> {
    const room = await get(child(ref(database), `rooms/${roomId}`));
    const roomData = room.val();
    return {
      ...roomData,
      id: room.key,
      questions: roomData.questions ? roomData.questions : [],
    };
  }

  async function getRoomByNumber(
    roomNumber: string,
    callback: (roomData: Room) => void
  ): Promise<void> {
    onValue(
      query(
        ref(database, "rooms"),
        orderByChild("number"),
        equalTo(Number(roomNumber)),
        limitToFirst(1)
      ),
      (rooms) => {
        if (rooms.size === 0) {
          alert("Esta sala não existe.");
        } else {
          rooms.forEach((room) => {
            const roomData = room.val();
            const roomDataWithId = {
              ...roomData,
              id: room.key,
              questions: roomData.questions ? roomData.questions : [],
            };
            callback(roomDataWithId);
          });
        }
      },
      (error) => {
        console.log(error);
        alert("Esta sala não existe.");
      }
    );
  }

  async function addQuestionToRoom(
    roomId: string,
    question: Question
  ): Promise<void> {
    const questionRef = await push(
      child(ref(database), `rooms/${roomId}/questions`),
      question
    );
    await update(
      ref(database, `rooms/${roomId}/questions/${questionRef.key}`),
      { id: questionRef.key }
    );
  }

  async function removeQuestionFromRoom(
    roomId: string,
    questionId: string
  ): Promise<void> {
    console.log(`rooms/${roomId}/questions/${questionId}`);
    await remove(ref(database, `rooms/${roomId}/questions/${questionId}`));
  }

  async function incrementQuestionLikes(
    roomId: string,
    questionId: string
  ): Promise<void> {
    const question = await (
      await get(child(ref(database), `rooms/${roomId}/questions/${questionId}`))
    ).val();
    await update(ref(database, `rooms/${roomId}/questions/${questionId}`), {
      likes: question.likes + 1,
    });
  }

  return (
    <RoomsContext.Provider
      value={{
        createRoom,
        closeRoom,
        getRoomById,
        getRoomByNumber,
        addQuestionToRoom,
        removeQuestionFromRoom,
        incrementQuestionLikes,
      }}
    >
      {children}
    </RoomsContext.Provider>
  );
}
