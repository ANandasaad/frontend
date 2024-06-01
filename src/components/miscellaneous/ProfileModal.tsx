import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { FaEye } from "react-icons/fa";

const ProfileModal = ({ user, children }: { user: any; children: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          aria-label={""}
          icon={<FaEye />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height="400px">
          <ModalHeader
            display="flex"
            fontFamily="Work sans"
            justifyContent="center"
            fontSize="40px"
          >
            {user?.data?.userLogin?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap="10"
            textAlign="center"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user?.data?.userLogin?.pic}
            />
            <Text
              fontSize={{ base: "20px", md: "20px" }}
              fontFamily="Work sans"
            >
              Email:{user?.data?.userLogin?.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModal;
