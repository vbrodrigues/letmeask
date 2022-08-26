import { User } from "phosphor-react";
import { FormEvent, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import bannerImg from "../assets/Banner.svg";
import logoImg from "../assets/Logo.svg";
import { SolidButton } from "../components/SolidButton";
import { useAuth } from "../hooks/useAuth";
import { useRooms } from "../hooks/useRoom";

export function AdminHome() {
  const [roomName, setRoomName] = useState("");

  const { user, signOut } = useAuth();

  const { createRoom } = useRooms();

  const navigate = useNavigate();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (!roomName.trim()) {
      return;
    }
    const roomId = await createRoom(roomName);

    navigate(`/admin/rooms/${roomId}`);
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

      <main className="flex flex-col flex-1 h-[100vh] justify-center items-center dark:bg-gray-900">
        <div className="flex flex-col gap-8 max-w-xs justify-start items-center">
          <img src={logoImg} alt="" className="h-20 mb-14" />

          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-3">
              <span className="bg-purple-300 rounded-full w-10 h-10 overflow-hidden flex justify-center items-center">
                {user?.avatar ? (
                  <img src={user?.avatar} alt="" />
                ) : (
                  <User color="#fff" size={20} />
                )}
              </span>
              <strong className="dark:text-gray-300">{user?.name}</strong>
            </span>
          </div>

          <p className="text-2xl font-bold font-title dark:text-gray-300">
            Crie uma nova sala
          </p>

          <div>
            <form className="flex flex-col gap-4" onSubmit={handleCreateRoom}>
              <input
                type="text"
                placeholder="Nome da sala"
                className="border border-gray-400 spacing tracking-wide text-gray-700 py-3 px-4 rounded-lg outline-none appearance-none font-semibold placeholder:font-normal placeholder:text-base"
                onChange={(event) => setRoomName(event.target.value)}
              />

              <SolidButton type="submit" color="main" text="Criar sala" />
            </form>
          </div>
          <span className="text-sm dark:text-gray-300">
            Quer entrar em uma sala já existente?{" "}
            <NavLink to="/admin/login">
              <a href="#" className="text-purple-500">
                Clique aqui
              </a>
            </NavLink>
          </span>
          <Link
            to="/admin/login"
            className="text-purple-300 hover:opacity-70 transition-opacity"
            onClick={() => signOut()}
          >
            Sair
          </Link>
        </div>
      </main>
    </div>
  );
}
