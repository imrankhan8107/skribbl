import React from "react";
import { io } from "socket.io-client";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setSocket } from "./store/game";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Start, WaitArea } from "./Pages";
import Loading from "./Pages/loading";



const socket = io("http://localhost:4000");
export const SocketContext = React.createContext({
  socket: null,
});
export const GameContext = React.createContext({
  Game: {},
  setGame: () => {},
  gameToken: null,
  setGameToken: () => {},
  playerId: localStorage.getItem("userId") ?? null,
  setPlayerId: () => {},
});

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Start />,
//   },
//   {
//     path: "/:gameId",
//     element: <Start />,
//   },
//   {
//     path: "/:gameId/wait",
//     element: <WaitArea />,
//   },
// ]);

export default function App() {
  // const dispatch = useDispatch();
  // dispatch(setSocket(socket));
  const [id, setid] = React.useState(null);
  const [Game, setGame] = React.useState({});
  const [gameToken, setGameToken] = React.useState(null);
  const [playerId, setPlayerId] = React.useState(
    localStorage.getItem("userId") ?? null
  );
  React.useEffect(() => {
    socket.on("connect", () => {
      // console.log("Connected to server");
      setid(socket.id);
    });
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socket,
      }}
    >
      <GameContext.Provider
        value={{
          Game,
          setGame,
          gameToken,
          setGameToken,
          playerId,
          setPlayerId,
        }}
      >
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<Start />} />
              <Route path="/loading" element={<Loading />} />
              <Route path="/:gameId" element={<Start />} />
              <Route path="/:gameId/wait" element={<WaitArea />} />
            </Routes>
          </Router>
        </div>
      </GameContext.Provider>
    </SocketContext.Provider>
  );
}
