import { Box, Image } from "@chakra-ui/react";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";

const FeedPost = ({ post }) => {
  const { userProfile } = useGetUserProfileById(post.createdBy);

  return (
    <>
      <PostHeader post={post} creatorProfile={userProfile} />
      <Box
        my={2}
        borderRadius={4}
        overflow={"hidden"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Image
          src={post.imageURL}
          alt={"FEED POST IMG"}
          minH={"30vh"}
          minW={"60vh"}
          alignItems={"center"}
          justifyContent={"center"}
        />
      </Box>
      <PostFooter post={post} creatorProfile={userProfile} />
    </>
  );
};

export default FeedPost;
