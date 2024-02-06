import {
  Flex,
  GridItem,
  Text,
  Button,
  Image,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Divider,
  VStack,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Comment from "../Comment/Comment";
import PostFooter from "../FeedPosts/PostFooter";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import useShowToast from "../../hooks/useShowToast";
import { useState } from "react";
import { deleteObject, ref } from "firebase/storage";
import { storage, firestore } from "../../firebase/firebase";
import { arrayRemove, doc, deleteDoc, updateDoc } from "firebase/firestore";
import usePostStore from "../../store/postStore";
import Caption from "../Comment/Caption";

const ProfilePost = ({ post }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePost = usePostStore((state) => state.deletePost);
  const decrementPostsCount = useUserProfileStore((state) => state.deletePost);

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    if (isDeleting) return;

    try {
      const imageRef = ref(storage, `posts/${post.id}`);
      await deleteObject(imageRef);
      const userRef = doc(firestore, "users", authUser.uid);
      await deleteDoc(doc(firestore, "posts", post.id));
      await updateDoc(userRef, {
        posts: arrayRemove(post.id),
      });
      deletePost(post.id);
      decrementPostsCount(post.id);
      showToast("Success", "Post deleted successfully!", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <GridItem
        cursor={"pointer"}
        borderRadius={4}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"whiteAlpha.300"}
        position={"relative"}
        aspectRatio={1 / 1}
        onClick={onOpen}
      >
        <Flex
          opacity={0}
          _hover={{ opacity: 1 }}
          position={"absolute"}
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={"blackAlpha.700"}
          transition={"all 0.3s ease"}
          zIndex={1}
          justifyContent={"center"}
        >
          <Flex alignItems={"center"} justifyContent={"center"} gap={50}>
            <Flex>
              <AiFillHeart size={20} />
              <Text fontWeight={"bold"} ml={2}>
                {post.likes.length}
              </Text>
            </Flex>
            <Flex>
              <FaComment size={20} />
              <Text fontWeight={"bold"} ml={2}>
                {post.comments.length}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Image
          src={post.imageURL}
          alt="profile post"
          w={"100%"}
          h={"100%"}
          objectFit={"cover"}
        />
      </GridItem>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered={true}
        size={{ base: "3xl", md: "5xl" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody bg={"black"} pb={5}>
            <Flex
              gap={4}
              w={{ base: "90%", sm: "70%", md: "full" }}
              mx={"auto"}
              maxH={"90vh"}
              minH={"50vh"}
              direction={{ base: "column", md: "row" }}
            >
              <Flex
                borderRadius={4}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"whiteAlpha.300"}
                flex={1.5}
                justifyContent={"center"}
                alignItems={"center"}
                position={{ base: "relative", md: "static" }}
              >
                <Image src={post.imageURL} alt="profile post" />
                {authUser?.uid === userProfile.uid && (
                  <Button
                    size={"sm"}
                    bg={"transparent"}
                    _hover={{ bg: "whiteAlpha.300", color: "red.600" }}
                    borderRadius={4}
                    p={1}
                    position={"absolute"}
                    top={2}
                    left={2}
                    onClick={handleDeletePost}
                    isLoading={isDeleting}
                    display={{ base: "flex", md: "none" }}
                  >
                    <MdDelete size={20} cursor={"pointer"} />
                  </Button>
                )}
              </Flex>
              <Flex
                flex={1}
                flexDir={"column"}
                px={10}
                display={{ base: "flex", md: "flex" }}
              >
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                  {/*Optional designing stuffs which I didn't like*/}
                  {/*<Flex alignItems={"center"} gap={4}>
                    <Avatar
                      src={userProfile.profilePicURL}
                      size={"sm"}
                      name={userProfile.fullName}
                    />
                    <Text fontWeight={"bold"} fontSize={12}>
                      {userProfile.username}
                    </Text>
                  </Flex>*/}

                  {/*Caption*/}
                  {post.caption && <Caption post={post} />}

                  {authUser?.uid === userProfile.uid && (
                    <Button
                      size={"sm"}
                      bg={"transparent"}
                      _hover={{ bg: "whiteAlpha.300", color: "red.600" }}
                      borderRadius={4}
                      p={1}
                      onClick={handleDeletePost}
                      isLoading={isDeleting}
                      display={{ base: "none", md: "flex" }}
                    >
                      <MdDelete size={20} cursor={"pointer"} />
                    </Button>
                  )}
                </Flex>
                <Divider my={4} bg={"gray.700"} />
                <VStack
                  w="full"
                  alignItems="start"
                  maxH="350px"
                  overflowY="auto"
                >
                  {post.comments.map((comment, index) => (
                    <Comment key={`${comment.id}-${index}`} comment={comment} />
                  ))}
                </VStack>
                {post.comments.length > 0 && <Divider my={4} bg={"gray.700"} />}
                <PostFooter isProfilePage={true} post={post} />
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfilePost;
