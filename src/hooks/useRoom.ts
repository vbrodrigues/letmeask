import { useContext } from "react";
import { RoomsContext } from "../contexts/roomsContext";

export function useRooms() {
  return useContext(RoomsContext);
}
