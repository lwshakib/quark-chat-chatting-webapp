import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import router from "./routes";
import { startMessageConsumer } from "./services/kafka";
import SocketService from "./services/socket";
dotenv.config();


const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 8000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use("/api", router);
(async () => {
    await startMessageConsumer();
})()
const socketService = new SocketService();
socketService.io.attach(httpServer);
socketService.initListeners();

httpServer.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});