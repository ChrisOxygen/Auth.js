import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function PasswordResetLinkSent() {
  return (
    <div className="md:px-[50px] px-0  lg:px-[100px] mx-auto w-full flex flex-col gap-5">
      <DotLottieReact
        src="https://lottie.host/af0c94e0-bf4a-4f77-ad09-75adc87b95e1/tKFRNgXJFU.lottie"
        autoplay
      />
      <div className="flex flex-col gap-2 items-center text-center">
        <h2 className="text-white md:text-4xl text-2xl font-thin">
          Password Reset Link Sent
        </h2>
        <p className="text-white/70 font-poppins ">
          We have sent you an email with a link to reset your password.
        </p>
      </div>
    </div>
  );
}

export default PasswordResetLinkSent;
