const { v4: uuidv4 } = require("uuid");
function SessionHandler(io, GameSocketService) {
  try {
    io.on("create-session", () => {
      const game = GameSocketService.createGame(uuidv4());
      io.gameToken = game.gameToken;
      io.emit("session-created", game);
    });
    io.on("join-session", (gameToken, playerName, playerId) => {
      if (playerId == "null" || typeof playerId == "object") {
        var playerId = uuidv4();
      }
      const game = GameSocketService.joinGame(gameToken, playerName, playerId);
      io.emit("session-joined", game, playerId);
      io.join(playerId);
      io.join(gameToken);
      io.to(gameToken).emit("game-updated", game);
      console.log("game", game);
    });

    io.on("leave-session", (gameToken, playerId) => {
      const game = GameSocketService.leaveGame(gameToken, playerId);
      console.log(game);
      io.to(gameToken).emit("game-updated", game);
    });
    io.on("canvas-data", (data) => {
      console.log(data);
    });
  } catch (err) {
    console.log(err);
  }
}
module.exports = SessionHandler;
