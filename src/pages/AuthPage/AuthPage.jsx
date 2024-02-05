import { Container, Flex } from '@chakra-ui/react'; //This package of ChakraProvider aligns all items in the center.
import { Box, Image, VStack } from '@chakra-ui/react';
import AuthForm from '../../components/AuthForm/AuthForm';

const AuthPage = () => {
  return (
    <Flex minH={"100vh"} justifyContent={"center"} alignItems={"center"} px={4}>
        <Container maxW={"container.md"} padding={0}> 
        <Flex justifyContent={"center"} alignItems={"center"} gap={10}>

        {/* Left hand-side */}
        <Box display={{base:"none",md:"block"}}> {/*for base screens(mobile) - image not displayed, for medium screens or above, image is diaplayed */}
            <Image src="/auth.png" h={650} alt="Phone img" />
        </Box>

        {/* Right hand side */}
        <VStack spacing={4} align={"stretch"}> {/*VStack - Vertical Stack, i.e. Flex with flex direction = column*/}
            <AuthForm />
            <Box textAlign={"center"}>Get The App.</Box>
            <Flex gap={5} justifyContent={"center"}>
                <Image src="/playstore.png" h={"10"} alt="Playstore.logo" />
                <Image src="/microsoft.png" h={"10"} alt="Microsoft.logo" />
            </Flex>
        </VStack>
        </Flex>
        </Container>
    </Flex>
  )
}

export default AuthPage