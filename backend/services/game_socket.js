const { Server } = require("socket.io");

class GameSocket {
  instance = null;
  games = {};
  // playerDetails = {};
  init(http_server) {
    if (this.instance) return;
    this.instance = new Server(http_server, {
      cors: {
        origin: "http://localhost:1234",
      },
    });
  }
  getInstance() {
    return this.instance;
  }
  getGame(gameId) {
    return this.games[gameId];
  }
  createGame(gameId) {
    this.games[gameId] = {
      players: {},
      gameData: {},
      gameToken: gameId,
      drawerNo: null,
      creatorId: null,
    };
    return this.games[gameId];
  }
  joinGame(gameId, playerName, playerId) {
    try {
      if (this.games[gameId].players[playerId]) {
        return this.games[gameId];
      } else {
        this.games[gameId].players[playerId] = {
          playerId: playerId,
          playerName: playerName,
          score: 0,
        };
      }
    } catch (err) {
      console.log(err);
    }
    return this.games[gameId];
  }

  leaveGame(gameId, playerId) {
    delete this.games[gameId].players[playerId];
    return this.games[gameId];
  }
}
module.exports = new GameSocket();
