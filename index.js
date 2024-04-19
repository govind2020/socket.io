const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const axios = require("axios")
const PORT = 3001;


// middleware
app.use(cors());


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  }
});

// database connection:-
// async function main() {
//   await mongoose.connect(
//     "mongodb+srv://govind:0OqoG9f5Vtt0csTQ@cluster0.vtyw0ay.mongodb.net/MetaFit?retryWrites=true&w=majority&appName=Cluster0"
//   );
//   console.log("Database Connected");
// }


// Function to fetch chat history from JSON server
// const fetchChatHistory = async (room) => {
//   try {
//       const response = await axios.get(`http://localhost:3002/rooms/`);
//       return response.data.messages || [];
//   } catch (error) {
//       console.error("Error fetching chat history:", error);
//       return [];
//   }
// };

// Function to save chat message to JSON server
const saveChatMessage = async (room, message) => {
  try {
    console.log('data here==>', room, message)
    const response = await axios.get(`http://localhost:3002/rooms`);
    const rooms = response.data.rooms || {};

    if (!rooms[room]) {
      rooms[room] = [];
    }
    rooms[room].push(message);

    await axios.patch(`http://localhost:3002/rooms`, { rooms });
  } catch (error) {
    console.error("Error saving chat message:", error);
  }
};

io.on("connection", async (socket) => {
  console.log(`User Connected id: ${socket.id}`);

  socket.on("join_room", async (data) => {
    console.log('data', data);
    socket.join(data);
    console.log(`USER JOIN ID: ${socket.id} JOIN ON : ${data} `);

    // Fetch chat history for the room and send it to the user
    // const chatHistory = await fetchChatHistory(data);
    // console.log('chatHistory=>', chatHistory)
    // socket.emit('chatHistory', chatHistory);
  });

  socket.on("send_message", async (data) => {
    socket.to(data.room).emit('receive_message', data);

    // Save the message to the JSON server
    // await saveChatMessage(data.room, data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnect", socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ${PORT}`);
});
