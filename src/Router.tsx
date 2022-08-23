import { Routes, Route } from "react-router-dom";
import { AdminHome } from "./pages/AdminHome";
import { Room } from "./pages/Room";
import { AdminLogin } from "./pages/AdminLogin";

export function Router() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/rooms/:roomNumber&:roomName" element={<Room />} />
    </Routes>
  );
}
