function ChatHandler(io) {
  io.on("message", (data) => {
    io.to(io.gameToken).emit("message", data);
  });
}

module.exports = ChatHandler;
