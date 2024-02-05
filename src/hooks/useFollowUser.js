import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";
import { firestore } from "../firebase/firebase";
import { arrayUnion, arrayRemove, doc, updateDoc } from "firebase/firestore";

const useFollowUser = (userId) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const authUser = useAuthStore((state) => state.user); //gets status of auth user.
  const setAuthUser = useAuthStore((state) => state.setUser);
  const { userProfile, setUserProfile } = useUserProfileStore();
  const showToast = useShowToast();

  const handleFollowUser = async () => {
    setIsUpdating(true);
    try {
      const currentUserRef = doc(firestore, "users", authUser.uid); //getting info of auth user.
      const userToFollowOrUnfollowRef = doc(firestore, "users", userId); //getting info of user to be followed or unfollowed.

      //Firebase updation
      await updateDoc(currentUserRef, {
        following: isFollowing ? arrayRemove(userId) : arrayUnion(userId),
      }); //updating following list

      await updateDoc(userToFollowOrUnfollowRef, {
        followers: isFollowing
          ? arrayRemove(authUser.uid)
          : arrayUnion(authUser.uid), //updating followers list
      });

      //State Updation
      if (isFollowing) {
        //unfollow
        setAuthUser({
          ...authUser, //separating the authUser data(which is in JSON format)
          following: authUser.following.filter((uid) => uid !== userId), //removing userId from the auth user following list in case of unfollow
        });
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            followers: userProfile.followers.filter(
              (uid) => uid !== authUser.uid,
            ), //removing authUserId from user followers list in case of unfollow
          });
        }

        //Local Storage updation
        localStorage.setItem(
          "user-info",
          JSON.stringify({
            ...authUser,
            following: authUser.following.filter((uid) => uid !== userId),
          }),
        );
        setIsFollowing(false);
      } else {
        //follow
        setAuthUser({
          ...authUser,
          following: [...authUser.following, userId], //adding new followed user to follower list of authUser
        });
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            followers: [...userProfile.followers, authUser.uid],
          });
        }

        localStorage.setItem(
          "user-info",
          JSON.stringify({
            ...authUser,
            following: [...authUser.following, userId],
          }),
        );
        setIsFollowing(true);
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      const isFollowing = authUser.following.includes(userId); //includes the followed user to the auth user's following list
      setIsFollowing(isFollowing);
    }
  }, [authUser, userId]);

  return { isUpdating, isFollowing, handleFollowUser };
};

export default useFollowUser;
