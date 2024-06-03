import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserListItem";
import UserBadgeItem from "../UserBadgeItem";

const GroupChatModal = ({ children }: { children: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState<any>();
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleGroup = async (user: any) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, user]);
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
  const handleSubmit = async () => {};
  const handleDelete = async (user: any) => {
    setSelectedUsers(
      selectedUsers.filter((sel: any) => sel?._id !== user?._id)
    );
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            display="flex"
            fontFamily="Work sans"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u: any) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading....</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user: any) => (
                  <UserListItem
                    key={user?._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
