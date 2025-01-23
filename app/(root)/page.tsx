import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <div
      className=" grid h-full p-5 "
      style={{
        backgroundImage: "url('/desert.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex  flex-col justify-between w-full">
        {/* <nav className="flex text-white items-center justify-between">
          <h3 className="font-bold text-xl uppercase">Auth.js</h3>
          <Link
            href="/"
            className="text-white text-sm rounded-xl flex items-center gap-1 font-poppins py-1 bg-white/15 px-3 font-thin"
          >
            <span className=" grid place-items-center">Back to home</span>
            <span className=" grid place-items-center">
              <FiArrowRight />
            </span>
          </Link>
        </nav> */}
        <NavBar />
        <div className=" w-full flex flex-col gap-5 items-center mb-2  ">
          <h4 className=" text-3xl capitalize text-center max-w-[400px] font-thin text-white">
            Auth.js , formerly <br /> known as NextAuth.js.
          </h4>
          <span className="h-[2px] w-[150px] bg-white rounded-lg"></span>
        </div>
      </div>
    </div>
  );
}
