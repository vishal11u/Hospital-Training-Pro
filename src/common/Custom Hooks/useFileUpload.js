import { useState } from "react";

const useFileUpload = () => {
  const [path, setPath] = useState();
  const [fileName, setFileName] = useState("");
  //Function used to convert Image to Base 64
  const fileToBase64 = (file, callBack) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      callBack(null, reader.result);
      const filename = file.name;
      setFileName(file.name);
      return file.name;
    };
    reader.onerror = function (error) {
      callBack(error, null);
    };
  };

  
  //Get the Selected file and set Converted Base64 image
  const onProfilePicChange = ({ target }) => {
    if (target.files < 1 || !target.validity.valid) {
      return;
    }
    fileToBase64(target.files[0], (err, result) => {
      if (result) {
        setPath(result);
      }
    });
  };

  const resetFileUpload = () => {
    setPath(null);
    setFileName("");
  };

  return {
    fileToBase64,
    onProfilePicChange,
    path,
    fileName,
    resetFileUpload,
  };
};

export default useFileUpload;