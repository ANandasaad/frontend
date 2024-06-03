import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { IoMdAddCircle } from "react-icons/io";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/Chatlogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
const MyChats = ({ fetchAgain }: { fetchAgain: any }) => {
  const [loggedUser, setloggedUser] = useState();
  const { selectChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.data.token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:3000/api/chat/fetch-chat",
        config
      );
      // console.log(data.data);
      setChats(data?.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast({
        title: "Error Occurred",
        description: "Failed to fetch chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") as any);
    setloggedUser(userInfo);
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<IoMdAddCircle />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat: any) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectChat?._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                color={selectChat?._id === chat._id ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
