import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { getSender, getSenderFull } from "../config/Chatlogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChat from "./miscellaneous/UpdateGroupChat";

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
            {/* message box */}
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
