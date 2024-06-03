import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChats from "./SingleChats";

const ChatBox = ({
  fetchAgain,
  setFetchAgain,
}: {
  fetchAgain: any;
  setFetchAgain: any;
}) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      fontSize={30}
      fontWeight="bold"
    >
      <SingleChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
