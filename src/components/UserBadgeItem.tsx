import { Box } from "@chakra-ui/react";
import React from "react";
import { IoClose } from "react-icons/io5";

const UserBadgeItem = ({
  handleFunction,
  user,
}: {
  handleFunction: any;
  user: any;
}) => {
  console.log(user.name, "user");
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      fontSize={12}
      bg="purple"
      cursor="pointer"
      onClick={handleFunction}
      textColor="white"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      {user?.name}
      <IoClose />
    </Box>
  );
};

export default UserBadgeItem;
