import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserListItem";

const UpdateGroupChat = ({
  fetchAgain,
  setFetchAgain,
}: {
  fetchAgain: any;
  setFetchAgain: any;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState<string>();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { selectChat, setSelectedChat, user } = ChatState();
  const toast = useToast();

  const handleRemove = async (user1: any) => {
    console.log(user);
    if (
      selectChat.groupAdmin._id !== user.data?.userLogin?._id &&
      user1._id !== user.data?.userLogin?._id
    ) {
      toast({
        title: "Only admins can remove someone",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.data?.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:3000/api/chat/remove-from-group/${selectChat?._id}`,
        {
          userId: user1?._id,
        },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data?.data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error as any,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleAddUser = async (user1: any) => {
    if (selectChat.user.find((u: any) => u._id === user1._id)) {
      toast({
        title: "User Already in group",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.data?.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:3000/api/chat/addUser-to-group/${selectChat._id}`,
        {
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data?.data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error as any,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.data?.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:3000/api/chat/update-group-name/${selectChat?._id}`,
        { name: groupChatName },
        config
      );

      setSelectedChat(data?.data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error as any,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.data?.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3000/api/user/get-users?search=${search}`,
        config
      );
      setSearchResult(data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  };
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<FaEye />}
        onClick={onOpen}
        aria-label={""}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectChat?.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectChat?.users?.map((u: any) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user: any) => (
                  <UserListItem
                    key={user?._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChat;
