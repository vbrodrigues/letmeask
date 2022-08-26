import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./contexts/authContext";
import { RoomsContextProvider } from "./contexts/roomsContext";
import { Router } from "./Router";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <RoomsContextProvider>
          <Router />
        </RoomsContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
