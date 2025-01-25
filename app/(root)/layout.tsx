function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className=" flex flex-col w-screen bg-slate-950 h-svh">
      {children}
    </main>
  );
}

export default layout;
