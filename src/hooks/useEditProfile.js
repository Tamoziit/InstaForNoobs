import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { firestore, storage } from "../firebase/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import useUserProfileStore from "../store/userProfileStore";

const useEditProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const setUserProfile = useUserProfileStore((state) => state.setUserProfile);
  const showToast = useShowToast();

  const editProfile = async (inputs, selectedFile) => {
    if (isUpdating || !authUser) {
      showToast("Error", "Something went wrong! Try Again.", "error");
      return;
    }
    setIsUpdating(true);
    const storageRef = ref(storage, `profilePics/${authUser.uid}`); //Referring to profile pic field in storage of authUser in firebase storage.
    const userDocRef = doc(firestore, "users", authUser.uid); //getting the user id from users collection in firestore.

    let URL = ""; //Initial value of image URL.
    try {
      if (selectedFile) {
        await uploadString(storageRef, selectedFile, "data_url"); //Passing storage reference, selected file & image(in data URL form).
        URL = await getDownloadURL(ref(storage, `profilePics/${authUser.uid}`)); //Getting the image URL of selected image from storage.
      }

      const updatedUser = {
        ...authUser, //to prevent overwriting of other data of the user like followers, posts, following etc.
        fullName: inputs.fullName || authUser.fullName,
        username: inputs.username || authUser.username,
        bio: inputs.bio || authUser.bio,
        profilePicURL: URL || authUser.profilePicURL,
      };

      //Getting every state containing user data in sync.
      await updateDoc(userDocRef, updatedUser); //Update user profile in firestore
      localStorage.setItem("user-info", JSON.stringify(updatedUser)); //Update user profile in local storage
      setAuthUser(updatedUser); //Updating user profile in Auth Store(auth state).
      setUserProfile(updatedUser); //Updating user profile in User Profile state.
      showToast("Success", "Profile updated Successfully!", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };
  return { editProfile, isUpdating };
};

export default useEditProfile;
