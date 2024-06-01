import { createContext, useContext } from "react";

const ChatContext = createContext<any>(null);

export default ChatContext;

export const ChatState = () => {
  return useContext(ChatContext);
};
