import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { getSender, getSenderFull } from "../config/Chatlogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChat from "./miscellaneous/UpdateGroupChat";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { BeatLoader } from "react-spinners";

const ENDPOINT = "http://localhost:3000";
var socket: Socket<DefaultEventsMap, DefaultEventsMap>, selectChatCompare: any;
const SingleChats = ({
  fetchAgain,
  setFetchAgain,
}: {
  fetchAgain: any;
  setFetchAgain: any;
}) => {
  const { user, selectChat, setSelectedChat } = ChatState();
  const [message, setMessage] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState<any>();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);
  const fetchMessage = async () => {
    try {
      if (!selectChat) return;
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.data.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3000/api/message/get-message/${selectChat?._id}`,
        config
      );

      setMessage(data?.data);
      setLoading(false);
      socket.emit("join chat", selectChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to fetch message",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const sendMessage = async (e: any) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.data.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `http://localhost:3000/api/message/create-message`,
          {
            content: newMessage,
            chatId: selectChat?._id,
          },
          config
        );
        socket.emit("new Message", data?.data);
        setMessage([...message, data.data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send message",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const typingHandler = (e: any) => {
    setNewMessage(e.target.value);

    //Typing Indicator
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectChat?._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectChat?._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    fetchMessage();
    selectChatCompare = selectChat;
  }, [selectChat]);

  useEffect(() => {
    socket.on("message received", (newMessageRec) => {
      if (
        !selectChatCompare ||
        selectChatCompare?._id !== newMessageRec.chat?._id
      ) {
        //TODO: give notification
      } else {
        setMessage([...message, newMessageRec]);
      }
    });
  });
  return (
    <>
      {selectChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<FaRegArrowAltCircleLeft />}
              onClick={() => setSelectedChat("")}
              aria-label={""}
            />
            {!selectChat.isGroupChat ? (
              <>
                {getSender(user, selectChat?.users)}{" "}
                <ProfileModal
                  user={getSenderFull(user, selectChat.users)}
                  children={undefined}
                />
              </>
            ) : (
              <>
                {selectChat?.chatName?.toUpperCase()}
                <UpdateGroupChat
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessage={fetchMessage}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflow="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="flex flex-col overflow-y-scroll">
                <ScrollableChat message={message} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <BeatLoader color="#36d7b7" size={20} className="px-2" />
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box h="100%" className="flex justify-center items-center">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChats;
