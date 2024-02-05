import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { firestore } from "../firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  orderBy,
} from "firebase/firestore";

const useGetSuggestedUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setIsLoading(true);
      try {
        const usersRef = collection(firestore, "users");
        const q = query(
          usersRef,
          where("uid", "not-in", [authUser.uid, ...authUser.following]), //to prevent suggesting ourselves & people we already follow in suggested users section. Also, following[] is an array --> putting it inside another array for checking makes it a nested array. In order to prevent this, we use ...authUser.following, which includes only the elements of following[], not the array itself.
          orderBy("uid"),
          limit(3),
        );
        const querySnap = await getDocs(q);
        const users = [];
        //Mapping Suggested users to users[] array
        querySnap.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        setSuggestedUsers(users);
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
