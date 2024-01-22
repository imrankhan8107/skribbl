const { instrument } = require("@socket.io/admin-ui");
const { ChatHandler, SessionHandler } = require("./handlers");
const GameSocketService = require("./services/game_socket");

const app = require("express")();
const server = require("http").createServer(app);
GameSocketService.init(server);

const io = GameSocketService.getInstance();

io.on("connection", (client) => {
  SessionHandler(client, GameSocketService);
  ChatHandler(client, GameSocketService);
});

// https://admin.socket.io/#/servers
instrument(io, { auth: false });

server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
