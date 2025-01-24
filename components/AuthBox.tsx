import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

// import { signOut } from "next-auth/react";
import Link from "next/link";

async function AuthBox() {
  // await the auth  must be called inside a sever side function
  const session = await auth();

  const isLoggedIn = session !== null;

  return (
    <div className="flex items-center gap-5">
      {isLoggedIn ? (
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
          className=""
        >
          <Button className=" bg-slate-800 font-semibold uppercase hover:bg-slate-900 transition-all border border-slate-800">
            Logout
          </Button>
        </form>
      ) : (
        <>
          {/* <Button
            onClick={() => signIn()}
            className=" bg-slate-800 font-semibold uppercase hover:bg-slate-900 transition-all border border-slate-800"
          >
            Sign in
          </Button> */}
          <Link
            href="/sign-in"
            className="text-white  rounded-sm flex items-center gap-1 font-poppins py-1 bg-white/15 px-3 font-thin"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-white  rounded-sm flex items-center gap-1 font-poppins py-1 bg-white/15 px-3 font-thin"
          >
            Creat an account
          </Link>
        </>
      )}
    </div>
  );
}

export default AuthBox;
