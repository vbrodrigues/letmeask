import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import bannerImg from "../assets/Banner.svg";
import logoImg from "../assets/Logo.svg";
import { SolidButton } from "../components/SolidButton";

export function AdminHome() {
  const [roomName, setRoomName] = useState("");

  const navigate = useNavigate();

  function handleCreateRoom(event) {
    event.preventDefault();
    const roomNumber = Math.floor(Math.random() * 899999 + 100000);
    navigate(`/rooms/${roomNumber}&${roomName}`);
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
        <div className="flex flex-col gap-8 max-w-xs justify-center items-center">
          <img src={logoImg} alt="" className="h-20 mb-14" />
          <p className="text-2xl font-bold">Crie uma nova sala</p>
          <div>
            <form className="flex flex-col gap-4" onSubmit={handleCreateRoom}>
              <input
                type="text"
                placeholder="Nome da sala"
                className="border border-gray-400 text-gray-800 py-3 px-4 rounded-lg outline-none appearance-none font-semibold placeholder:text-base"
                onChange={(event) => setRoomName(event.target.value)}
              />

              <SolidButton type="submit" color="main" text="Criar sala" />

              <span className="text-sm">
                Quer entrar em uma sala já existente?{" "}
                <NavLink to="/admin/login">
                  <a href="#" className="text-purple-500">
                    Clique aqui
                  </a>
                </NavLink>
              </span>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
