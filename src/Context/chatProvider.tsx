import React, { useEffect, useState } from "react";
import ChatContext from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
const ChatProvider: React.FC<any> = ({ children }) => {
  const [user, setUser] = useState<any>();
  const [selectChat, setSelectedChat] = useState<any>(null);
  const [chats, setChats] = useState<any>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        setUser(parsedUserInfo);
      } catch (error) {
        console.error("Failed to parse user info from localStorage", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
