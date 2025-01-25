"use client";

import { useMutation } from "@tanstack/react-query";
import PulseLoader from "./PulseLoader";
import { verifyUserEmail } from "@/actions/user.action";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import RegenerateVerificationLink from "./RegenerateVerificationLink";
import ToastBox from "./ToastBox";

type VerificationResponseProps = {
  isVerified: boolean;
  name: string;
  userId: string;
  verificationCode: string;
};

function VerificationResponse({
  isVerified,
  name,
  userId,
  verificationCode,
}: VerificationResponseProps) {
  const { mutate, isPending, isError, isSuccess, error } = useMutation({
    mutationFn: () => verifyUserEmail(verificationCode, userId),
    onSuccess: () => {
      toast.custom(
        (t) => {
          const closeToast = () => {
            toast.dismiss(t);
            redirect("/");
          };
          return (
            <ToastBox
              variant="success"
              title="Email verified!"
              handleClose={closeToast}
              message=" Your email has been verified, you can now enjoy all the features of our platform"
            />
          );
        },
        {
          unstyled: true,
          style: {
            backgroundColor: "transparent",
          },
          onAutoClose: (t) => {
            toast.dismiss(t.id);
            redirect("/");
          },

          classNames: {
            toast: " bg-red-500 w-full",
          },
        }
      );
    },
    onError: (error) => {
      // An error happened!

      console.error("error", error);
    },
  });

  useEffect(() => {
    if (!isVerified) {
      mutate();
    }
  }, [mutate, isVerified]);

  return (
    <div className="border  max-h-max  border-white/30 rounded-2xl px-7 py-9 flex flex-col items-center gap-3">
      <h3 className="text-4xl font-poppins text-white capitalize">Hi {name}</h3>
      <p className=" font-poppins text-lg text-white">
        {isVerified && (
          <div className="">
            <p className="">Your email has been verified</p>
            <Button className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3">
              Continue to home
            </Button>
          </div>
        )}
      </p>
      {isPending && (
        <div className="flex flex-col items-center justify-center gap-5">
          <p className=" font-poppins text-lg text-white">
            Verifying your email...
          </p>
          <PulseLoader />
        </div>
      )}

      {isError && (
        <RegenerateVerificationLink userId={userId} errMsg={error?.message} />
      )}
      {isSuccess && (
        <p className=" font-poppins text-lg text-white">
          Your email has been verified
        </p>
      )}
    </div>
  );
}

export default VerificationResponse;
