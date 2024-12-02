import express from 'express';
import { createServer } from 'http';
import { join } from 'path';
import { Server } from 'socket.io';
import * as humanjs from '@vladmandic/human';

const config = { 
    backend: "webgl",
    modelBasePath: "file://models/",
};

const human = new humanjs.Human(config);

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
    }
  });

io.on("connection", (socket) => {
  socket.on("image", async (buffer) => {
    
    const tensor = human.tf.node.decodeImage(buffer);
    const result = await human.detect(tensor);
    console.log(result);
    
    socket.emit("result", result);
  });
});
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});