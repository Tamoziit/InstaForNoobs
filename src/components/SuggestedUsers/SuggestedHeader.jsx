import { Flex, Avatar, Text, Button } from "@chakra-ui/react";
import useLogout from "../../hooks/useLogout";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

const SuggestedHeader = () => {
  const { handleLogout, isLoggingOut } = useLogout();
  const authUser = useAuthStore((state) => state.user); //to extract user data from zustand.

  if (!authUser) return null;

  return (
    <Flex
      justifyContent={"space-between"}
      alignItems={"center"}
      w={"full"}
      position={"sticky"}
      top={0}
      right={0}
    >
      <Flex alignItems={"center"} gap={2}>
        <Link to={`${authUser.username}`}>
          <Avatar size={"lg"} src={authUser.profilePicURL} />
        </Link>
        <Link to={`${authUser.username}`}>
          <Text fontSize={12} fontWeight={"bold"}>
            {authUser.username}
          </Text>
        </Link>
      </Flex>
      <Button
        size={"xs"}
        background={"transparent"}
        fontSize={14}
        fontWeight={"medium"}
        color={"blue.500"}
        cursor={"pointer"}
        _hover={{ color: "white" }}
        onClick={() => handleLogout()}
        isLoading={isLoggingOut}
      >
        Log out
      </Button>
    </Flex>
  );
};

export default SuggestedHeader;
