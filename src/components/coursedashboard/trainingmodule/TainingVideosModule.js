import React from "react";
import CustomAccordion from "../../../common/VideoAccordian";

function TainingVideosModule({ setDefaultVideoUrl, modules, setVideoStatus}) {
  return (
    <div className="px-2">
      <CustomAccordion
        modules={modules}
        setDefaultVideoUrl={setDefaultVideoUrl}
        setVideoStatus={setVideoStatus}
      />
    </div>
  );
}

export default React.memo(TainingVideosModule);
