import { useState } from "react";

import "./App.css";
import { Outlet, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import backgroundImage from "./background.jpg";
import ChatProvider from "../src/Context/chatProvider.tsx";
import { ChakraProvider } from "@chakra-ui/react";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/chats",
        element: <ChatPage />,
      },
    ],
  },
]);
const appStyles = {
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  height: "100vh",
  width: "100vw",
};
function App() {
  return (
    <div style={appStyles}>
      <ChatProvider>
        <ChakraProvider>
          <Outlet />
        </ChakraProvider>
      </ChatProvider>
    </div>
  );
}

export default App;
