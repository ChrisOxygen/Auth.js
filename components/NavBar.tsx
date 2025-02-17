import React from "react";
import AuthBox from "./AuthBox";

function NavBar() {
  return (
    <nav className=" w-full  py-4 flex md:flex-row flex-col gap-3 md:items-start items-center justify-between px-5 border-b border-white/10">
      <h3 className="font-bold text-xl uppercase">Auth.js</h3>
      <AuthBox />
    </nav>
  );
}

export default NavBar;
