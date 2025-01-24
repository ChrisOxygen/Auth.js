import React from "react";

function PulseLoader() {
  return (
    <div className="flex justify-center items-center">
      <div className="relative inline-flex">
        <div className="w-8 h-8 bg-[#6132ec] rounded-full"></div>
        <div className="w-8 h-8 bg-[#6132ec] rounded-full absolute top-0 left-0 animate-ping"></div>
        <div className="w-8 h-8 bg-[#6132ec] rounded-full absolute top-0 left-0 animate-pulse"></div>
      </div>
    </div>
  );
}

export default PulseLoader;
