import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";

const SingleChats = ({
  fetchAgain,
  setFetchAgain,
}: {
  fetchAgain: any;
  setFetchAgain: any;
}) => {
  const { user, selectChat, setSelectedChat } = ChatState();
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
              <></>
            ) : (
              <>{selectChat?.chatName?.toUpperCase()}</>
            )}
          </Text>
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
