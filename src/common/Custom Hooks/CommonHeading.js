import React from "react";

export default function CommonHeading(header) {
  return (
    <div className="mt-14">
      <h1 className="text-center text-[18px] font-semibold  whitespace-nowrap pb-4">
        {header}
      </h1>
    </div>
  );
} 
