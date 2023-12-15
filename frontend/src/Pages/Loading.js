import React, { useContext, useEffect } from "react";
import { GameContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Loading() {
  const { gameToken, Game } = useContext(GameContext);
  console.log("on load page", gameToken);
  console.log("on load page", Game);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (!gameToken) {
  //       navigate("/");
  //     }
  //   }, []);

  useEffect(() => {
    if (!!gameToken) {
      navigate(`/${gameToken}/wait`);
    }
  }, [gameToken, navigate]);

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}
