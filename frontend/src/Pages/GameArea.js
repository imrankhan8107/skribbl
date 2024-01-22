import React, { useEffect, useState } from "react";
// import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../App";

export default function GameArea() {
  const { socket } = React.useContext(SocketContext);
  // const { editor, onReady } = useFabricJSEditor();
  const canvasRef = React.useRef(null);
  const { gameId } = useParams();
  // const [sendingQueue, setsendingQueue] = useState([]);
  let batch = [];
  let isRequestTImed = false;
  let startX, startY, currentX, currentY;

  function sendDrawCommand(command, currentX, currentY) {
    batch.push([command, startX, startY, currentX, currentY]);
    startX = currentX;
    startY = currentY;
    if (!isRequestTImed) {
      setTimeout(() => {
        socket.emit("draw", gameId, batch);
        console.log(batch);
        isRequestTImed = false;
        batch = [];
      }, 200);
      isRequestTImed = true;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, 500, 500);
    let drawing = false;
    function drawOnCanvas(startX, startY, currentX, currentY) {
      console.log(startX, startY, currentX, currentY);
      ctx.fillStyle = "rgb(0,0,255)";
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    }
    canvasRef.current.addEventListener("mousedown", (e) => {
      startX = e.pageX - canvas.offsetLeft;
      startY = e.pageY - canvas.offsetTop;
      drawing = true;
      // setsendingQueue((prev) => [...prev, { startX, startY }]);
      // canvasRef.current.addEventListener("mousemove", onMouseMove);
    });
    canvas.addEventListener("mousemove", (e) => {
      console.log(e);
      // startX = e.pageX - canvas.offsetLeft;
      // startY = e.pageY - canvas.offsetTop;

      currentX = e.offsetX;
      currentY = e.offsetY;

      if (drawing) {
        //   if (eraser) {
        // eraseOnCanvas(currentX, currentY);
        //   sendDrawCommand(1, currentX, currentY);
        // } else {
        drawOnCanvas(startX, startY, currentX, currentY);
        sendDrawCommand(0, currentX, currentY);
        // startX = currentX;
        // startY = currentY;
        // }
      }
      canvas.addEventListener("mouseup", (e) => {
        drawing = false;
        // canvasRef.current.removeEventListener("mousemove", onMouseMove);
      });
    });
    socket.on("canvasChanges", (data) => {
      console.log("incomming data", data);
      data.forEach((element) => {
        drawOnCanvas(element[1], element[2], element[3], element[4]);
      });
      // drawOnCanvas(data[1], data[2], data[3], data[4]);
      // if (data[0] == 0) {
      //   drawOnCanvas(data[1], data[2], data[3], data[4]);
      // } else {
      //   eraseOnCanvas(data[1], data[2], data[3], data[4]);
      // }
    });
  }, [canvasRef.current, socket]);
  // React.useEffect(() => {
  //   if (!editor || !fabric) {
  //     return;
  //   }
  //   editor.canvas.isDrawingMode = true;
  //   editor.canvas.setHeight(250);
  //   editor.canvas.setWidth(250);
  //   editor.canvas.renderAll();
  // }, [editor?.canvas.backgroundImage]);

  return (
    <div>
      <h1>Game Area</h1>
      {/* <FabricJSCanvas
        onReady={onReady}
        style={{
          border: "1px solid black",
        }}
      /> */}
      <canvas
        id="drawing-area"
        ref={canvasRef}
        width="500"
        height="500"
      ></canvas>
    </div>
  );
}
