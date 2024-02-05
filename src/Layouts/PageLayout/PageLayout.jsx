import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";

// Instead of adding the sidebar components to every page, we can add it only once to the PageLayout componenet and wrap the children with it. This way, we can have a sidebar on every page on except the AuthPage. --> {pathname !== "/auth" ?.....}

const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  const [user, loading] = useAuthState(auth); //for checking if user is authenticated(Logged in) or not
  const canRenderSidebar = pathname !== "/auth" && user; //sidebar bar is rendered iff, the page is not auth page & the user is logged in.
  const canRenderNavbar = !user && !loading && pathname !== "/auth"; //navbar is rendered iff, user is not logged in, nothing is checking in the background & pge is not authpage.

  //For Loading spinner(Buffering)
  const checkingUserIsAuth = !user && loading; //checking if user is not authenticated & there is loading in the BG.
  if (checkingUserIsAuth) return <PageLayoutSpinner />;

  return (
    <Flex flexDir={canRenderNavbar ? "column" : "row"}>
      {/* Sidebar on the left */}
      {canRenderSidebar ? (
        <Box w={{ base: "70px", md: "240px" }}>
          <Sidebar />
        </Box>
      ) : null}

      {/* NavBar on top */}
      {canRenderNavbar ? <Navbar /> : null}

      {/* Content on the right */}
      <Box
        flex={1}
        w={{ base: "calc(100%-70px)", md: "calc(100%-240px)" }}
        mx={"auto"}
      >
        {children}
      </Box>
    </Flex>
  );
};

export default PageLayout;

//Creating the Loading Spinner
const PageLayoutSpinner = () => {
  return (
    <Flex
      flexDir="column"
      h="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner size="xl" />
    </Flex>
  );
};
