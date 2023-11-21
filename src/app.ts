import express from "express";
import indexRouter from "./routes/index";
import { chatSetup } from "./chat/chat";
import { Server } from "socket.io";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

chatSetup(new Server(
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  }))
);
