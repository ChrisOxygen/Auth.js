import { auth } from "@/auth";
import NavBar from "@/components/NavBar";
import NotificationBar from "@/components/NotificationBar";

export default async function Home() {
  const session = await auth();

  const isLoggedIn = session !== null;

  const isVerified = session?.user?.isVerified;

  console.log("isVerified", isVerified);

  //grid h-full grid-rows-[60px,1fr]
  return (
    <div className="flex flex-col w-full h-screen">
      {isLoggedIn && !isVerified && <NotificationBar />}
      <div
        className=" grid h-full p-5 "
        style={{
          backgroundImage: "url('/desert.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex  flex-col justify-between w-full">
          <NavBar />
          <div className=" w-full flex flex-col gap-5 items-center mb-2  ">
            <h4 className=" text-3xl capitalize text-center max-w-[400px] font-thin text-white">
              Auth.js , formerly <br /> known as NextAuth.js.
            </h4>
            <span className="h-[2px] w-[150px] bg-white rounded-lg"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
