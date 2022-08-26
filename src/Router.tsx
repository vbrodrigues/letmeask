import { Routes, Route } from "react-router-dom";
import { AdminHome } from "./pages/AdminHome";
import { RoomAdmin } from "./pages/RoomAdmin";
import { AdminLogin } from "./pages/AdminLogin";
import { RoomUser } from "./pages/RoomUser";
import { UserLogin } from "./pages/UserLogin";

export function Router() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/rooms/new" element={<AdminHome />} />
      <Route path="/admin/rooms/:roomId" element={<RoomAdmin />} />
      <Route path="/users/rooms/:roomId" element={<RoomUser />} />
      <Route path="/users/login" element={<UserLogin />} />
    </Routes>
  );
}
