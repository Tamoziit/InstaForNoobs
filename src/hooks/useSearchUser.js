import { useState } from "react";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useSearchUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const showToast = useShowToast();

  const getUserProfile = async (username) => {
    setIsLoading(true);
    setUser(null); //to set searched user state to null before searching for a new user.
    try {
      const q = query(
        collection(firestore, "users"),
        where("username", "==", username),
      ); //query to find user by the searched username

      const querySnap = await getDocs(q);
      if (querySnap.empty)
        //if searched user is not found.
        return showToast("Error", "User not found", "error");

      querySnap.forEach((doc) => {
        setUser(doc.data()); //If user is found, then setting user state with the data of the user.
      });
    } catch (error) {
      showToast("Error", error.message, "error");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getUserProfile, user, setUser };
};

export default useSearchUser;
