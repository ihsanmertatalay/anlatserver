import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from './router/router.js';
import http from 'http'; // Import the http module
import { Server } from 'socket.io'; // Import the Socket.io server

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

// Use http module to create an http server and pass it to express
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
}); 
app.use('/', router);

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle incoming socket events here
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log("Server and Socket.io are listening on port", process.env.PORT);
    });
  })
  .catch((err) => console.log(err));
