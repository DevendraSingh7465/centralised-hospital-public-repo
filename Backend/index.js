// Packages
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

const { chat } = require("./Controller/gemini_controller");

// CORS Options
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true, // Important for cookies
};

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));


// Socket.io
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
// const httpServer = createServer(app);

const io = new Server(server, {
    cors: corsOptions,
});


io.on('connection', (socket) => {
    // console.log("new uSer Connected:", socket.id);
    socket.on("join_room", (data) => {
        console.log("room:", data);
        socket.join(data);
    })
    socket.on("send_query", async (data) => {
        console.log("Question From frontend:", data.question);
        const question = data.question;
        const gemini_response = await chat(question);
        console.log("socket ai responee :", gemini_response);
        socket.to(data.room).emit("answer", { answer: gemini_response });
    })
})

server.listen(process.env.PORT || 8000, () => {
    console.log("Socket Server is Running...")
})



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};
connectDB();

// app.listen(process.env.PORT || 8000, () => {
//     console.log(`Server listening on PORT : ${process.env.PORT || 8000}`);
// });

// Routes Files
const authRoutes = require('./Routes/auth_routes');
const adminRoutes = require('./Routes/admin_routes');
const hospitalRoutes = require('./Routes/hospital_routes');
const doctorRoutes = require('./Routes/doctor_routes');
const userRoutes = require('./Routes/user_routes');
const geminiRoutes = require('./Routes/gemini_routes');

// Middlewares
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/doctor", doctorRoutes);
app.use("/user", userRoutes);
app.use("/ai", geminiRoutes);

