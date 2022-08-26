import { Copy, SignOut, User } from "phosphor-react";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logoImg from "../assets/Logo.svg";
import noQuestionsImg from "../assets/ChatBubbles.svg";
import { Question } from "../components/Question";
import { SolidButton } from "../components/SolidButton";
import { useAuth } from "../hooks/useAuth";
import { Room, Question as IQuestion } from "../contexts/roomsContext";
import { useRooms } from "../hooks/useRoom";
import { uuidv4 } from "@firebase/util";

export function RoomUser() {
  const { roomId } = useParams<{
    roomId: string;
  }>();

  const [room, setRoom] = useState({} as Room);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [questionText, setQuestionText] = useState("");

  const { getRoomById, addQuestionToRoom, incrementQuestionLikes } = useRooms();

  useEffect(() => {
    async function fetchRoom() {
      if (roomId) {
        const room = await getRoomById(roomId);

        if (room) {
          setRoom(room);
          const questionsArray = [];
          for (const [questionId, question] of Object.entries(room.questions)) {
            questionsArray.push(question);
          }
          setQuestions(questionsArray);
        }
      }
    }

    fetchRoom();
  }, [roomId, getRoomById]);

  const roomNumberParsed = Number(room.number);

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );

  const { user } = useAuth();

  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);

  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const navigate = useNavigate();

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();
    await addQuestionToRoom(roomId, {
      author: { id: user.id, name: user?.name, avatar: user?.avatar },
      content: questionText,
      createdAt: new Date().toISOString(),
      likes: 0,
    });
    event.target.value = "";
  }

  function handleSelectQuestion(questionId: string) {
    const isAnswered = answeredQuestionIds.find(
      (question) => question === questionId
    );

    if (isAnswered) {
      return;
    }

    if (questionId === selectedQuestionId) {
      setSelectedQuestionId(null);
    } else {
      setSelectedQuestionId(questionId);
    }
  }

  function handleFinishQuestion(questionId: string) {
    setAnsweredQuestionIds((state) => [...state, questionId]);
  }

  function handleDeleteQuestion(questionId: string) {
    const question = questions.find((q) => q.id === questionId);

    if (question) {
      setQuestions((state) => state.filter((q) => q.id !== questionId));
    }
  }

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(roomNumberParsed.toString());
    setCopiedToClipboard((state) => !state);
    setTimeout(() => {
      setCopiedToClipboard((state) => !state);
    }, 1000);
  }

  function handleLeaveRoom() {
    navigate("/users/login");
  }

  async function handleLikeQuestion(questionId: string) {
    await incrementQuestionLikes(roomId, questionId);
  }

  return (
    <div className="flex flex-col justify-center items-center m-auto gap-16 bg-gray-300">
      <div className="border-b border-b-gray-500 w-[100%] flex flex-col items-center">
        <header className="flex justify-between w-[1440px] items-center mx-40 my-6 ">
          <img src={logoImg} alt="" className="w-28" />
          <div className="flex items-center">
            <div className="flex gap-2 max-h-10 items-center">
              <p
                className={`text-gray-900 text-sm font-title ${
                  copiedToClipboard ? "" : "hidden"
                }`}
              >
                Copiado!
              </p>
              <div className="flex w-40 h-10 rounded-lg overflow-hidden border border-purple-300">
                <span
                  className="flex w-11 items-center justify-center bg-purple-300 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={handleCopyToClipboard}
                >
                  <Copy size={24} color="#f8f8f8" />
                </span>
                <span className="flex items-center justify-center text-gray-900 text-sm px-3 py-3">
                  <p className="font-bold">Sala #{roomNumberParsed}</p>
                </span>
              </div>
            </div>
            <SignOut
              size={24}
              color="#835AFD"
              className="ml-4 hover:cursor-pointer hover:opacity-70 transition-opacity"
              onClick={handleLeaveRoom}
            />
          </div>
        </header>
      </div>

      <main className="flex w-[800px] flex-col gap-6 bg-gray-300">
        <div className="flex gap-4 items-center">
          <strong className="text-2xl font-title">{room.title}</strong>
        </div>

        <form
          className="flex flex-col items-end gap-4 mb-4"
          onSubmit={handleSendQuestion}
        >
          <textarea
            maxLength={140}
            className="resize-none max-h-36 w-full p-4 rounded-lg shadow-sm border outline-none focus:border focus:border-purple-300"
            placeholder="O que você quer perguntar?"
            onChange={(event) => setQuestionText(event.target.value)}
          />
          <div className="flex justify-between w-full">
            <div className="flex gap-4 items-center">
              <span className="flex items-center gap-3">
                <span className="bg-purple-300 rounded-full w-10 h-10 overflow-hidden flex justify-center items-center">
                  {user?.avatar ? (
                    <img src={user?.avatar} alt="" />
                  ) : (
                    <User color="#fff" size={20} />
                  )}
                </span>
                <strong>{"Vítor Rodrigues"}</strong>
              </span>
            </div>
            <SolidButton
              color="main"
              text="Enviar pergunta"
              size="big"
              type="submit"
            />
          </div>
        </form>

        {questions.length === 0 ? (
          <div className="flex flex-col justify-center items-center gap-4 mt-40 text-center">
            <img src={noQuestionsImg} alt="" />
            <strong className="text-xl">Nenhuma pergunta por aqui...</strong>
            <p className="text-gray-700 leading-relaxed">
              Envie o código desta sala para seus amigos e comece a responder
              perguntas!
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {questions.map(
                (question) =>
                  !answeredQuestionIds.find(
                    (questionId) => questionId === question.id
                  ) && (
                    <Question
                      key={question.id}
                      id={question.id}
                      author={question.author}
                      initialLikes={question.likes}
                      type="user"
                      onSelect={() => handleSelectQuestion(question.id)}
                      onFinish={() => handleFinishQuestion(question.id)}
                      onDelete={() => handleDeleteQuestion(question.id)}
                      onLike={() => handleLikeQuestion(question.id)}
                      state={
                        answeredQuestionIds.find(
                          (questionId) => questionId === question.id
                        )
                          ? "answered"
                          : selectedQuestionId === question.id
                          ? "selected"
                          : "default"
                      }
                    >
                      {question.content}
                    </Question>
                  )
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
