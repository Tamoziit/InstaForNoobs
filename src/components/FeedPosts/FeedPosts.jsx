import {
  Container,
  VStack,
  Flex,
  SkeletonCircle,
  Box,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import FeedPost from "./FeedPost";
import useGetFeedPosts from "../../hooks/useGetFeedPosts";

//Passing params {img, username, avatar} to FeedPost.jsx, which in turn passes these to PostHeader.jsx & PostFooter.jsx
const FeedPosts = () => {
  const { isLoading, posts } = useGetFeedPosts();

  //Container contains the loading skeleton for all 4 childs{ [0,1,2,3].map } & params to be passed to FeedPost.jsx, if loading state is false.
  return (
    <Container maxW={"container.sm"} py={10} px={2}>
      {isLoading &&
        [0, 1, 2].map((_, idx) => (
          <VStack key={idx} gap={4} alignItems={"flex-start"} mb={10}>
            <Flex gap="2">
              <SkeletonCircle size="10" />
              <VStack gap={2} alignItems={"flex-start"}>
                <Skeleton height="10px" w={"200px"} />
                <Skeleton height="10px" w={"200px"} />
              </VStack>
            </Flex>
            <Skeleton w={"full"}>
              <Box h={"400px"}>contents wrapped</Box>
            </Skeleton>
          </VStack>
        ))}
      {!isLoading &&
        posts.length > 0 &&
        posts.map((post) => <FeedPost key={post.id} post={post} />)}
      {!isLoading && posts.length === 0 && (
        <>
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            flexDir={"column"}
          >
            <Text fontSize={"2xl"} color={"red.400"}>
              Looks like you don't have any new Posts!! &#128534;&#128534;
            </Text>
            <Text fontSize={"xl"} color={"red.400"}>
              Maybe its time to make some new friends... &#129395;{" "}
            </Text>
          </Flex>
        </>
      )}
    </Container>
  );
};

export default FeedPosts;
