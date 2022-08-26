import { SignOut } from "phosphor-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerImg from "../assets/Banner.svg";
import logoImg from "../assets/Logo.svg";
import googleLogo from "../assets/Google.svg";
import { SolidButton } from "../components/SolidButton";
import { useRooms } from "../hooks/useRoom";

export function UserLogin() {
  const [roomNumber, setRoomNumber] = useState("");

  const { getRoomByNumber } = useRooms();

  const navigate = useNavigate();

  function handleLogin() {
    navigate("/rooms/new");
  }

  async function handleEnterRoom(event: FormEvent) {
    event.preventDefault();
    await getRoomByNumber(roomNumber, (room) => {
      navigate(`/users/rooms/${room?.id}`);
    });
  }

  return (
    <div className="flex">
      <aside className="bg-purple-300 w-[62rem] h-[100vh] flex flex-col justify-center items-center">
        <div className="max-w-md flex flex-col gap-4">
          <img src={bannerImg} alt="" className="w-80" />
          <strong className="text-gray-100 text-4xl">
            Toda pergunta tem uma resposta.
          </strong>
          <p className="text-gray-100 opacity-70 text-2xl">
            Aprenda e compartilhe conhecimento com outras pessoas
          </p>
        </div>
      </aside>

      <main className="flex flex-col flex-1 h-[100vh] justify-center items-center">
        <div className="flex flex-col gap-8 justify-center items-center">
          <img src={logoImg} alt="" className="h-20 mb-14" />
          <SolidButton
            color="danger"
            text="Crie sua sala com o Google"
            icon={<img src={googleLogo} alt="Google Logo" />}
            onClick={handleLogin}
          />

          <div className="flex items-center">
            <div className="h-[1px] w-16 border-t border-gray-400 mr-4"></div>
            <span className="text-gray-400">ou entre em uma sala</span>
            <div className="h-[1px] w-16 border-t border-gray-400 ml-4"></div>
          </div>

          <div>
            <form className="flex flex-col gap-4" onSubmit={handleEnterRoom}>
              <input
                type="number"
                placeholder="# Digite o código da sala"
                className="border border-gray-400 text-gray-800 text-lg py-3 px-4 rounded-lg outline-none text-center appearance-none font-semibold placeholder:text-base"
                onChange={(event) => setRoomNumber(event.target.value)}
              />

              <SolidButton
                type="submit"
                color="main"
                text="Entrar na sala"
                icon={<SignOut weight="bold" size={24} />}
              />
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
