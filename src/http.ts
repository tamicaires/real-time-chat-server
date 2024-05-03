import express from "express";
import * as http from "http";
import { router } from "./routes/routes";
import cors from "cors";
import { Server } from "socket.io";

const app = express();

const serverHttp = http.createServer(app);
const io = new Server(serverHttp, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(router);

export { serverHttp, io };
