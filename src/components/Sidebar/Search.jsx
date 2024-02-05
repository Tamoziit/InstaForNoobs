import {
  Box,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Tooltip,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { SearchLogo } from "../../assets/constants";
import useSearchUser from "../../hooks/useSearchUser";
import { useRef } from "react";
import SuggestedUser from "../SuggestedUsers/SuggestedUser";

const Search = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isLoading, getUserProfile, setUser } = useSearchUser();
  const searchRef = useRef(null); //alternative to useState
  const handleSearchUser = (e) => {
    //handles an event --> form submission
    e.preventDefault();
    getUserProfile(searchRef.current.value); //gets the user with the searched username stored in searchRef
  };
  console.log(user);

  return (
    <>
      <Tooltip
        hasArrow
        label={"Search"}
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
          onClick={onOpen}
        >
          <SearchLogo />
          <Box display={{ base: "none", md: "block" }}>Search</Box>
        </Flex>
      </Tooltip>

      {/*Search Modal*/}
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft">
        <ModalOverlay />
        <ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
          <ModalHeader>Serach User</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSearchUser}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input placeholder="Search..." ref={searchRef} />{" "}
              </FormControl>

              <Flex w={"full"} justifyContent={"flex-end"}>
                <Button
                  type="submit"
                  ml={"auto"}
                  size={"sm"}
                  my={4}
                  isLoading={isLoading}
                >
                  Search
                </Button>
              </Flex>
            </form>
            {user && <SuggestedUser user={user} setUser={setUser} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Search;
