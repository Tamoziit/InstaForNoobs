import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useUserProfileStore from "../store/userProfileStore";

const useGetUserProfileByUsername = (username) => {
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowToast();
  const { userProfile, setUserProfile } = useUserProfileStore();
  //alternative to : const userProfile = useUserProfileStore((state) => state.userProfile);

  useEffect(() => {
    const getUserProfile = async () => {
      setIsLoading(true);
      try {
        //Logic to fetch if userProfile is present or not, if present passing it to profile page.
        const q = query(
          collection(firestore, "users"),
          where("username", "==", username),
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return setUserProfile(null);

        let userDoc;
        querySnapshot.forEach((doc) => {
          userDoc = doc.data();
        });

        setUserProfile(userDoc);
        //console.log(userDoc);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading(false); //after fetching, loading & checking is over.
      }
    };
    getUserProfile();
  }, [setUserProfile, username, showToast]); //this doesn"t give an infinite loop problem because of callBack is useShowToast.js

  return { isLoading, userProfile };
};

export default useGetUserProfileByUsername;
