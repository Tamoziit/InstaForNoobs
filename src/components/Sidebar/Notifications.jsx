import {
  Tooltip,
  Flex,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useMediaQuery,
} from "@chakra-ui/react";
import { NotificationsLogo } from "../../assets/constants";
import SuggestedUsers from "../SuggestedUsers/SuggestedUsers";

const Notifications = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSmallerThanMd] = useMediaQuery("(max-width: 767.98px)");

  return (
    <>
      <Tooltip
        hasArrow
        label={"Notifications"}
        placement="right"
        ml={1}
        openDelay={500}
        display={{ base: "block", md: "none" }}
      >
        <Flex
          alignItems={"center"}
          gap={4}
          _hover={{ bg: "whiteAlpha.400" }}
          borderRadius={6}
          p={2}
          w={{ base: 10, md: "full" }}
          justifyContent={{ base: "center", md: "flex-start" }}
          onClick={() => isSmallerThanMd && onOpen()}
        >
          <NotificationsLogo />
          <Box display={{ base: "none", md: "block" }}>Notifications</Box>
        </Flex>
      </Tooltip>

      {/* Displaying SuggestedUsers only for small tabs in notification */}
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft">
        <ModalOverlay />
        <ModalContent bg={"black"} border={"1px solid gray"} maxW={"350px"}>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SuggestedUsers />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Notifications;
