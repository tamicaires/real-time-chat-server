import { io } from "./http";

io.on("connection", (socket) => {

  socket.on("message", (message) => {
    console.log("Mensagem enviada de volta para o cliente:", message);
  });

  socket.on("chat-room", (rooms) => {
    console.log("Chat Room enviados para o cliente:", rooms);
  });

  socket.on("add-user-room", (rooms) => {
    console.log("Chat Room enviados para o cliente:", rooms);
  });

});
