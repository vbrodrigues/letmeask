import { Copy, XCircle } from "phosphor-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logoImg from "../assets/Logo.svg";
import noQuestionsImg from "../assets/ChatBubbles.svg";
import { BorderButton } from "../components/BorderButton";
import { Question } from "../components/Question";
import { Modal } from "../components/Modal";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import { SolidButton } from "../components/SolidButton";
import { useRooms } from "../hooks/useRoom";
import { Room, Question as IQuestion } from "../contexts/roomsContext";

export function RoomAdmin() {
  const { roomId } = useParams<{
    roomId: string;
  }>();

  const [room, setRoom] = useState<Room | undefined>({} as Room);
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const { getRoomById, closeRoom, removeQuestionFromRoom } = useRooms();

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

  const roomNumberParsed = Number(room?.number);

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );

  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);

  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const answeredQuestions = questions
    ? questions.filter((question) =>
        answeredQuestionIds.find((q) => q === question.id)
      )
    : [];

  const navigate = useNavigate();

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

  async function handleDeleteQuestion(questionId: string) {
    const question = questions.find((q) => q.id === questionId);

    if (question) {
      await removeQuestionFromRoom(roomId, questionId);
      setQuestions((state) => state.filter((q) => q.id !== questionId));
    }
  }

  async function handleCloseRoom() {
    setQuestions([]);

    if (roomId) {
      await closeRoom(roomId);
    }

    navigate("/rooms/new");
  }

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(roomNumberParsed.toString());
    setCopiedToClipboard((state) => !state);
    setTimeout(() => {
      setCopiedToClipboard((state) => !state);
    }, 1000);
  }

  return (
    <div className="flex flex-col justify-center items-center m-auto gap-16 bg-gray-300">
      <div className="border-b border-b-gray-500 w-[100%] flex flex-col items-center">
        <header className="flex justify-between w-[1440px] items-center mx-40 my-6 ">
          <img src={logoImg} alt="" className="w-28" />
          <div className="flex gap-2 max-h-10 items-center">
            <div className="flex w-40 h-10 rounded-lg overflow-hidden border border-purple-300">
              <Tooltip.Provider disableHoverableContent>
                <Tooltip.Root delayDuration={0}>
                  <Tooltip.Trigger
                    onMouseEnter={(event) => {
                      event.preventDefault();
                    }}
                    onMouseLeave={(event) => {
                      event.preventDefault();
                    }}
                    onClick={handleCopyToClipboard}
                    className="flex w-11 items-center justify-center bg-purple-300 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <span
                      className="flex w-11 items-center justify-center bg-purple-300 cursor-pointer hover:opacity-90 transition-opacity"
                      // onClick={handleCopyToClipboard}
                    >
                      <Copy size={24} color="#f8f8f8" />
                    </span>
                  </Tooltip.Trigger>
                  <Tooltip.Content
                    side="left"
                    sideOffset={8}
                    className={`${copiedToClipboard ? "" : "hidden"}`}
                  >
                    <Tooltip.Arrow className="fill-gray-100" />
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-gray-700 text-sm font-title">
                        Copiado!
                      </p>
                    </div>
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
              <span className="flex items-center justify-center text-gray-900 text-sm px-3 py-3">
                <p className="font-bold">Sala #{roomNumberParsed}</p>
              </span>
            </div>
            <Modal
              trigger={
                <BorderButton size="small" color="main" text="Encerrar sala" />
              }
              title={
                <div className="flex flex-col gap-6 mb-3 items-center">
                  <XCircle size={48} color="#E73F5D" />
                  <strong className="text-2xl font-title">Encerrar sala</strong>
                </div>
              }
              description="Tem certeza que você deseja encerrar esta sala?"
              content={
                <div className="flex gap-4 mt-10">
                  <Dialog.Close>
                    <SolidButton color="grayed" text="Cancelar" size="medium" />
                  </Dialog.Close>
                  <Dialog.Close>
                    <SolidButton
                      color="danger"
                      text="Sim, encerrar"
                      size="medium"
                      onClick={handleCloseRoom}
                    />
                  </Dialog.Close>
                </div>
              }
            />
          </div>
        </header>
      </div>

      {!!room && room.isActive ? (
        <main className="flex w-[800px] flex-col gap-6 bg-gray-300">
          <div className="flex gap-4 items-center">
            <strong className="text-2xl font-title">{room.title}</strong>
            <span className="bg-pink-500 rounded-full px-4 py-2 text-gray-100 text-sm">
              {questions.length - answeredQuestions.length} perguntas
            </span>
          </div>

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
                        onSelect={() => handleSelectQuestion(question.id)}
                        onFinish={() => handleFinishQuestion(question.id)}
                        onDelete={() => handleDeleteQuestion(question.id)}
                        onLike={() => {}}
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

              <p className="text-gray-700 mt-2">
                Perguntas já respondidas ({answeredQuestions.length})
              </p>
              <div className="flex flex-col gap-4">
                {answeredQuestions.map((question) => (
                  <Question
                    key={question.id}
                    id={question.id}
                    author={question.author}
                    likes={question.likes}
                    onSelect={() => handleSelectQuestion(question.id)}
                    onFinish={() => handleFinishQuestion(question.id)}
                    onDelete={() => handleDeleteQuestion(question.id)}
                    state="answered"
                  >
                    {question.content}
                  </Question>
                ))}
              </div>
            </>
          )}
        </main>
      ) : (
        <p>Essa sala já foi encerrada.</p>
      )}
    </div>
  );
}
