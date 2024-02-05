import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const showToast = useShowToast();
  const maxFileSizeInBytes = 10 * 1024 * 1024; //10MB

  const handleImageChange = (e) => {
    const file = e.target.files[0]; //get the selected file.
    if (file && file.type.startsWith("image/")) {
      //checking if the selected file type is an image or not.
      if (file.size > maxFileSizeInBytes) {
        showToast("Error", "Please select an image file within 10 MB", "error");
        setSelectedFile(null);
        return;
      }
      const reader = new FileReader(); //Creating reader object

      reader.onloadend = () => {
        setSelectedFile(reader.result); //setting the image data as the selected file.
      };

      reader.readAsDataURL(file); //GETs the image file & converts it into a base 64 string
    } else {
      showToast("Error", "Please select an image file", "error");
      setSelectedFile(null);
    }
  };
  return { selectedFile, handleImageChange, setSelectedFile };
};

export default usePreviewImg;
