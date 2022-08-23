import { Copy } from "phosphor-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logoImg from "../assets/Logo.svg";
import noQuestionsImg from "../assets/ChatBubbles.svg";
import { BorderButton } from "../components/BorderButton";
import { Question } from "../components/Question";

interface IQuestion {
  id: number;
  text: string;
  author: {
    name: string;
    avatar?: string | null;
  };
  likes: number;
}

const mockQuestions: IQuestion[] = [
  {
    id: 1,
    text: "Olá, eu gostaria de saber como criar um componente funcional dentro do React e se existe diferença na perfomance entre um componente com classes.",
    author: {
      name: "Vítor Borba Rodrigues",
      avatar: "https://github.com/vbrodrigues.png",
    },
    likes: 4,
  },
  {
    id: 2,
    text: "Olá, eu gostaria de saber como criar um componente funcional dentro do React e se existe diferença na perfomance entre um componente com classes.",
    author: {
      name: "Sara De Cesaro",
      avatar: null,
    },
    likes: 1,
  },
  {
    id: 3,
    text: "Olá, eu gostaria de saber como criar um componente funcional dentro do React e se existe diferença na perfomance entre um componente com classes.",
    author: {
      name: "Rafael Stuginski",
      avatar: "https://github.com/rafinski.png",
    },
    likes: 0,
  },
  {
    id: 4,
    text: "Olá, eu gostaria de saber como criar um componente funcional dentro do React e se existe diferença na perfomance entre um componente com classes.",
    author: {
      name: "Eduardo Gutkoski",
      avatar: "https://github.com/gutkedu.png",
    },
    likes: 10,
  },
];

export function Room() {
  const { roomNumber, roomName } = useParams<{
    roomNumber: string;
    roomName: string;
  }>();

  const roomNumberParsed = Number(roomNumber);

  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );

  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<number[]>([]);

  const answeredQuestions = questions.filter((question) =>
    answeredQuestionIds.find((q) => q === question.id)
  );

  const navigate = useNavigate();

  async function fetchQuestions() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const newQuestions = mockQuestions.sort((a, b) => b.likes - a.likes);
    setQuestions(newQuestions);
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  function handleSelectQuestion(questionId: number) {
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

  function handleFinishQuestion(questionId: number) {
    setAnsweredQuestionIds((state) => [...state, questionId]);
  }

  function handleDeleteQuestion(questionId: number) {
    const question = questions.find((q) => q.id === questionId);

    if (question) {
      setQuestions((state) => state.filter((q) => q.id !== questionId));
    }
  }

  function handleCloseRoom() {
    setQuestions([]);
    navigate("/admin/home");
  }

  console.log(answeredQuestionIds);

  return (
    <div className="flex flex-col justify-center items-center m-auto gap-16 bg-gray-300">
      <div className="border-b border-b-gray-500 w-[100%] flex flex-col items-center">
        <header className="flex justify-between w-[1440px] mx-40 my-6 ">
          <img src={logoImg} alt="" className="w-28" />
          <div className="flex gap-2">
            <div className="flex w-40 h-10 rounded-lg overflow-hidden border border-purple-300">
              <span className="flex w-11 items-center justify-center bg-purple-300 cursor-pointer hover:opacity-90 transition-opacity">
                <Copy size={24} color="#f8f8f8" />
              </span>
              <span className="flex items-center justify-center font-bold text-gray-900 text-sm px-3 py-3">
                <p>Sala #{roomNumberParsed}</p>
              </span>
            </div>
            <BorderButton
              size="small"
              color="main"
              text="Encerrar sala"
              onClick={handleCloseRoom}
            />
          </div>
        </header>
      </div>

      <main className="flex w-[800px] flex-col gap-6 bg-gray-300">
        <div className="flex gap-4 items-center">
          <strong className="text-2xl">{roomName}</strong>
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
                      likes={question.likes}
                      onSelect={() => handleSelectQuestion(question.id)}
                      onFinish={() => handleFinishQuestion(question.id)}
                      onDelete={() => handleDeleteQuestion(question.id)}
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
                      {question.text}
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
                  {question.text}
                </Question>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
