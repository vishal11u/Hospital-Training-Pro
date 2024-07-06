import React from "react";
import medicine from "./assets/medicine.png";
import sad from "./assets/sad.png";

function IndentErrorPage() {
  return (
    <div className="px-6 py-16 h-auto">
      <div className="flex space-x-10 items-center">
        <div className=" border rounded-full  h-[350px] w-[350px] flex items-center text-center justify-center bg-[#DEF2FE]">
          <div className="animate-bounce animation-delay-200">
            <img src={sad} className="h-[200px] " />
          </div>
        </div>
        <div className="relative right-24">
          <h1 className="text-5xl text-customBlue animate-pulse">Hmm.</h1>
          <h1 className="text-2xl text-customBlue">
            You Are Not Authorized <br /> To Access The Page. <br />
            Please Contact Administartor
          </h1>
        </div>
      </div>
    </div>
  );
}

export default IndentErrorPage;
