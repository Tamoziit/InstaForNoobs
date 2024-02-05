import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import "../firebase/firebase"; //to prevent firebase not found error.
import { auth, firestore } from "../firebase/firebase";
import {
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

//Creating React Hook for Sign up functionality. (Backend service)
const useSignUpWithEmailAndPassword = () => {
  const [createUserWithEmailAndPassword, loading, error] =
    useCreateUserWithEmailAndPassword(auth); //react hook that helps in creating a user acc. with email & password.

  const showToast = useShowToast();

  const loginUser = useAuthStore((state) => state.login);

  const signup = async (inputs) => {
    if (
      !inputs.email ||
      !inputs.password ||
      !inputs.username ||
      !inputs.fullName
    ) {
      showToast("Error", "Please fill all the fields", "error");
      return;
    }

    //Checking for duplicate username with same email problem.
    const usersRef = collection(firestore, "users"); //Reference to firebase collection - "users"
    const q = query(usersRef, where("username", "==", inputs.username)); //setting up a query to check if the input username is equal to an already existing username in the DB.
    const querySnapshot = await getDocs(q);

    //If the querySnapshot is not empty, i.e., an username has been entered, then throwing error if 'q' state is true(which is stored in querySnapshot).
    if (!querySnapshot.empty) {
      showToast("Error", "Username already exists", "error");
      return;
    }

    try {
      const newUser = await createUserWithEmailAndPassword(
        inputs.email,
        inputs.password,
      );
      if (!newUser && error) {
        showToast("Error", error.message, "error");
        return;
      }
      if (newUser) {
        //initializing user DB for storage in firestore.
        const userDoc = {
          uid: newUser.user.uid,
          email: inputs.email,
          username: inputs.username,
          fullName: inputs.fullName,
          bio: "",
          profilePicURL: "",
          followers: [],
          following: [],
          posts: [],
          createdAt: Date.now(),
        };
        await setDoc(doc(firestore, "users", newUser.user.uid), userDoc); //Adding a doc or user by calling addDoc & collection func. from firebase/firestore --> it takes in the location of the db (here: firestore), collection name ("users"). The 2nd parameter is the user data stored in the object userDoc.

        localStorage.setItem("user-info", JSON.stringify(userDoc)); //Storing a copy of the user data in local storage as key-value pair.
        loginUser(userDoc);
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return { loading, error, signup };
};

export default useSignUpWithEmailAndPassword;
