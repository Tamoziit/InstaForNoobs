import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { firestore } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const useGetSuggestedUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setIsLoading(true);
      try {
        const usersRef = query(
          collection(firestore, "users"),
          where("uid", "!=", authUser.uid),
        );
        const userDocs = await getDocs(usersRef);
        const users = [];
        //Mapping all users to users[] array
        userDocs.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        //Filter out users already followed by authUser
        const filteredUsers = users.filter(
          (user) => !authUser.following.includes(user.uid),
        );
        //Sort users by number of mutual followers
        const sortedUsers = filteredUsers.sort((a, b) => {
          const mutualFollowersA = a.followers.filter((follower) =>
            authUser.following.includes(follower),
          ).length;
          const mutualFollowersB = b.followers.filter((follower) =>
            authUser.following.includes(follower),
          ).length;
          return mutualFollowersB - mutualFollowersA;
        });
        //Get the top 3 users
        const suggestedUsers = sortedUsers.slice(0, 3);
        setSuggestedUsers(suggestedUsers);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser) getSuggestedUsers();
  }, [authUser, showToast]);
  return { isLoading, setIsLoading, suggestedUsers };
};

export default useGetSuggestedUsers;
