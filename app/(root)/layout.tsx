import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className=" flex flex-col w-screen bg-slate-950 h-screen">
      {children}
    </main>
  );
}

export default layout;
