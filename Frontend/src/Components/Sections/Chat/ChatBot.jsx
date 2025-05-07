import React, { useEffect, useRef, useState } from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { TbMessageChatbot } from "react-icons/tb";
import { IoSend } from "react-icons/io5";
import { useForm } from "react-hook-form";
import axios from "axios";
import { io } from "socket.io-client";
import Chat from "./Chat";

const ChatBot = () => {
  // States
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [userID, setUserID] = useState("");
  const [dialogBox, setDialogBox] = useState(false);
  const [userChat, setUserChat] = useState([]);
  const [loading, setLoading] = useState(false);

  // socket.io
  const SOCKET_URL = import.meta.env.VITE_API_BACKEND;
  const socket = io.connect(SOCKET_URL);

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ shouldUnregister: true });

  // Scroll at bottom while chatting
  const chatAreaRef = useRef(null);
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [userChat]);

  const handleChat = () => {
    setDialogBox(!dialogBox);
  };

  const sendQuery = async (data) => {
    console.log(data);
    setLoading(true);
    setUserChat((prevUserChat) => [
      ...prevUserChat,
      { id: Date.now(), chat: data.question, type: "user" },
    ]);
    reset();
    socket.emit("send_query", {
      question: data.question,
      room: userID,
    });
  };

  useEffect(() => {
    socket.on("answer", (data) => {
      setUserChat((prevUserChat) => [
        ...prevUserChat,
        { id: Date.now(), chat: data.answer, type: "ai" },
      ]);
      setLoading(false);
    });
  }, [socket, setUserChat]);

  useEffect(() => {
    console.log("userChat state:", userChat);
  }, [userChat]);

  const fetchJWT = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND}/auth/jwt`, {
        withCredentials: true,
      });
      setIsUserLogin(true);
      setUserID(response.data._id);
      if (response.data._id !== "") {
        console.log("fetch JWT ID:", response.data._id);
        socket.emit("join_room", response.data._id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchJWT();
  }, []);

  return (
    <>
      {isUserLogin && (
        <div>
          <div className="fixed bottom-5 right-5 z-[1000] bg-emerald-500 text-white p-3 rounded-full cursor-pointer border-1 border-white">
            <IoChatboxEllipsesOutline size={30} onClick={handleChat} />
          </div>

          {dialogBox && (
            <div className="fixed bottom-20 right-5 z-[1000] border-1 bg-white text-emerald-600 lg:min-w-[25vw] lg:max-w-[25vw] sm:min-w-[60vw] sm:max-w-[60vw] md:min-w-[40vw] md:max-w-[40vw] min-h-[60vh] rounded-2xl">
              <div className="w-full  flex justify-center items-center py-2 bg-emerald-50 rounded-t-2xl">
                <TbMessageChatbot size={30} /> AI Assistance
              </div>

              {/* Chat Area */}
              <div
                className="overflow-y-auto min-h-[45vh] max-h-[45vh]"
                ref={chatAreaRef}
              >
                {userChat.map((msg) => (
                  <Chat key={msg.id} message={msg.chat} type={msg.type} />
                ))}

                {loading && (
                  <div className="p-4">
                    <span className="loading loading-dots loading-xl text-primary"></span>
                  </div>
                )}
              </div>

              {/* Input field and send button */}
              <div className="min-h-[8vh] flex justify-center items-center p-3 bg-emerald-50 rounded-b-2xl">
                <form
                  onSubmit={handleSubmit((data) => sendQuery(data))}
                  className="w-full max-w-lg"
                >
                  <div className="flex rounded-lg shadow-sm overflow-hidden">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Ask a question..."
                      required
                      className="flex-grow h-12 px-4 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      {...register("question", { required: true })}
                    />
                    <button
                      type="submit"
                      className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <IoSend className="h-6 w-6" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;
