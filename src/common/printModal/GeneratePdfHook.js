import { useState, useEffect } from "react";

const useGeneratePdf = (response) => {
  const [fileURL, setFileURL] = useState(null);

  useEffect(() => {
    const generatePdf = async () => {
      const blb = new Blob([response?.data], { type: "text/plain" });
      const reader = new FileReader();

      reader.addEventListener("loadend", (e) => {
        if (e.target.result.charAt(0) !== "{") {
          const file = new Blob([response?.data], {
            type: "application/pdf",
          });
          const url = URL.createObjectURL(file);
          setFileURL(url);
        }
      });

      reader.readAsText(blb);
    };

    generatePdf();

    // Clean up the file URL when the component unmounts
    return () => {
      if (fileURL) {
        URL.revokeObjectURL(fileURL);
      }
    };
  }, [response]);

  return fileURL;
};

export default useGeneratePdf;
