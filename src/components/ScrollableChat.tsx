import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender } from "../config/Chatlogics";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ message }: { message: any }) => {
  const { user } = ChatState();
  console.log(message, "message");

  return (
    <ScrollableFeed>
      {message &&
        message.map((m: any, i: any) => (
          <div
            className={`flex ${
              m.sender._id === user?.data?.userLogin?._id
                ? "justify-start"
                : "justify-end"
            }`}
            key={m._id}
          >
            {m.sender._id !== user?.data?.userLogin?._id && (
              <Tooltip
                label={m?.sender?.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m?.sender?.name}
                  src={m?.sender?.pic}
                />
              </Tooltip>
            )}
            {m.sender._id === user?.data?.userLogin?._id && (
              <Tooltip
                label={m?.sender?.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m?.sender?.name}
                  src={m?.sender?.pic}
                />
              </Tooltip>
            )}
            <span
              className={`${
                m?.sender?._id === user?.data?.userLogin?._id
                  ? "bg-blue-100"
                  : "bg-orange-300"
              } px-2 py-4 w-100 text-xs rounded-lg text-center`}
            >
              {m?.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
