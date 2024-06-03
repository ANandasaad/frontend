import {
  Avatar,
  Box,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserListItem";
const SideDrawer = () => {
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<string[] | any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingChat, setLoadingChat] = useState<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setSelectedChat, chats, setChats } = ChatState();

  const navigate = useNavigate();
  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search ",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.data.token}`,
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
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  };

  const accessChat = async (userId: string) => {
    try {
      setLoadingChat(true);

      if (!user || !user.data || !user.data.token) {
        throw new Error("User token is not available");
      }

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const response = await axios.post(
        `http://localhost:3000/api/chat/access-chat/${userId}`,
        {}, // Provide an empty object for the body of the POST request
        config
      );

      const chatData = response.data.data;
      console.log(chatData);

      if (!chats.find((c: any) => c._id === chatData._id)) {
        setChats([chatData, ...chats]);
      }

      setSelectedChat(chatData);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoadingChat(false);
      console.error("Error fetching the chat:", error);
      toast({
        title: "Error fetching the chat",

        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        className="px-1 py-2"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <FaSearch />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text
          fontSize="2xl"
          fontFamily="Work sans"
          fontWeight="Bold"
          className="text-red-600"
        >
          Red Room
        </Text>

        <div className="flex items-center gap-4">
          <Menu>
            <MenuButton p={1}>
              <FaBell className="text-2xl" />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<FaCaretDown />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.data?.userLogin?.name}
                src={user?.data?.userLogin?.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuDivider />
              <MenuItem onClick={logOutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name and email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user: any) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
