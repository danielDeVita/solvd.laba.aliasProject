import express from "express";
import indexRouter from "./routes/index";
import chatRouter from "./routes/chat";
import { chatSetup } from "./chat/chat";
import { Server } from "socket.io";


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use('/chat', chatRouter);
chatSetup(new Server(
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  }))
);
