import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GameContext, SocketContext } from "../App";
// import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import "../styles/Start.css";

export default function Start() {
  const { editor, onReady } = useFabricJSEditor();
  const { gameId } = useParams();
  const [userName, setUserName] = useState("");
  const { Game, setGame, playerId, setPlayerId, gameToken, setGameToken } =
    React.useContext(GameContext);
  setGameToken(gameId ?? Game.gameToken);
  const { socket } = React.useContext(SocketContext);
  const [cropImage, setCropImage] = useState(true);

  const exportSVG = () => {
    const svg = editor.canvas.toJSON();
    console.info(svg.objects.length);
    console.info(svg.objects.slice(2));
  };
  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.setHeight(250);
    editor.canvas.setWidth(250);
    editor.canvas.add(
      new fabric.Circle({
        left: 50,
        top: 10,
        radius: 50,
        fill: "grey",
      })
    );
    editor.canvas.add(
      new fabric.Ellipse({
        left: 20,
        top: 90,
        rx: 80,
        ry: 200,
        fill: "grey",
      })
    );
    editor.canvas.renderAll();
  }, [editor?.canvas.backgroundImage]);
  // canvasRef.current = new fabric.Canvas("drawing-area", {

  //   isDrawingMode: true,
  //   width: 200,
  //   height: 200,
  // });
  // canvasRef1.current = new fabric.Canvas("drawing-area-1", {
  //   isDrawingMode: true,
  //   width: 200,
  //   height: 200,
  // });
  // var canvas = canvasRef.current;
  // var ctx = canvas.getContext("2d");
  // var canvas1 = canvasRef1.current;
  // var ctx1 = canvas1.getContext("2d");
  // canvasRef.current.add(
  //   new fabric.Circle({
  //     left: 100,
  //     top: 100,
  //     radius: 50,
  //     fill: "red",
  //   })
  // );
  const toggleDraw = () => {
    editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
  };
  function startGame() {
    socket.emit("create-session");
    socket.on("session-created", (game) => {
      setGame(game);
      setGameToken(game.gameToken);
      localStorage.setItem("gameToken", game.gameToken);
      joinGame(game.gameToken, userName, playerId);
    });
  }
  function joinGame(gameToken, userName, playerId) {
    socket.emit("join-session", gameToken, userName, playerId);
    socket.on("session-joined", (game, playerId) => {
      setGame(game);
      localStorage.setItem("userId", playerId);
      setPlayerId(playerId);
    });
  }

  function onClick() {
    if (gameId) {
      joinGame(gameToken, userName, playerId);
    } else {
      startGame();
    }
  }
  localStorage.setItem("gameToken", gameToken);
  const handleCanvasChange = () => {
    // This function is called whenever the canvas changes
    // You can send live canvas data here
    const canvasData = editor.canvas.toJSON();
    console.log("Canvas data:", canvasData);
    // Send the canvas data to your server or wherever it's needed
  };
  const handleMouseClick = (e) => {
    console.log("Mouse click event:", e);
    // Update canvas data as needed
    // canvas.add(
    //   new fabric.Circle({
    //     radius: 10,
    //     fill: "red",
    //     top: e.pointer.y,
    //     left: e.pointer.x,
    //   })
    // );
    // Trigger canvas change
    handleCanvasChange();
  };
  return (
    <div>
      <h1>React App</h1>
      <h1>{socket.id}</h1>
      <FabricJSCanvas
        className="sample-canvas"
        onReady={onReady}
        onChange={handleCanvasChange}
        onMouseDown={handleMouseClick}
      />
      <br />
      <input
        type="text"
        placeholder="Enter name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <br />
      {!!gameToken ? (
        <Link to={`/${gameToken}/wait`}>
          <button onClick={onClick}>Join game</button>
        </Link>
      ) : (
        <Link to="/loading">
          <button onClick={onClick}>Start Game</button>
        </Link>
      )}
      <button
        onClick={() => {
          socket.emit("canvas-data", editor.canvas.toJSON());
        }}
      >
        Get Json canvas
      </button>
      <button onClick={toggleDraw} disabled={!cropImage}>
        Toggle draw
      </button>
      <button onClick={exportSVG} disabled={!cropImage}>
        {" "}
        ToSVG
      </button>
    </div>
  );
}
