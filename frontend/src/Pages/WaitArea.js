import React, { useContext, useEffect } from "react";
import { GameContext, SocketContext } from "../App";
import Chat from "../Components/Chat";
import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";

export default function WaitArea() {
  // const { gameToken, Game, socket } = useSelector((state) => state.gameReducer);
  const { socket } = useContext(SocketContext);
  const { gameToken, Game, setGame, playerId } = useContext(GameContext);
  const GameUrl = `http://localhost:1234/${gameToken}`;
  useEffect(() => {
    socket.on("game-updated", (game) => {
      // dispatch(setGame(game));
      setGame(game);
    });
  }, [socket]);

  useEffect(() => {
    window.addEventListener("beforeunload", (ev) => {
      // ev.preventDefault();
      socket.emit("leave-session", gameToken, playerId);
    });
  }, [socket, gameToken, playerId]);
  return (
    <div>
      <h1>Game token: {gameToken}</h1>
      <div>
        <dl>
          <dt>Game Token</dt>
          <dd>{gameToken}</dd>
          <dt>Players</dt>
          <dd>
            <ul>
              {Object.entries(Game.players ?? {}).map(([key, value]) => (
                <li key={key}>{value.playerName}</li>
              ))}
            </ul>
          </dd>
        </dl>
      </div>
      <div>
        <center>
          <h2>{GameUrl}</h2>
          <button
            onClick={() => {
              navigator.clipboard.writeText(GameUrl);
            }}
          >
            Copy URL
          </button>
          <Link to={`/${gameToken}/game`}>
            <button
              onClick={() => {
                socket.emit("start-game", gameToken);
              }}
            >
              Start Game
            </button>
          </Link>
        </center>
      </div>
      <Chat />
    </div>
  );
}
