"use client";

import { useMutation } from "@tanstack/react-query";
import PulseLoader from "./PulseLoader";
import { verifyUserEmail } from "@/actions/user.action";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import RegenerateVerificationLink from "./RegenerateVerificationLink";

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
      toast("email verified", {
        cancel: {
          label: "Cancel",
          onClick: () => redirect("/"),
        },

        onAutoClose: (t) => {
          toast.dismiss(t.id);
          redirect("/");
        },
      });
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
