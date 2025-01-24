import { Toaster } from "@/components/ui/sonner";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className=" flex flex-col w-screen bg-slate-950 h-screen">
      {children}
      <Toaster />
    </main>
  );
}

export default layout;
