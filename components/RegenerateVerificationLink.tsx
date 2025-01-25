"use client";

import React from "react";
import { Button } from "./ui/button";
import { generateAndSendEmailVerificationCode } from "@/actions/user.action";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import ToastBox from "./ToastBox";
import { redirect } from "next/navigation";

function RegenerateVerificationLink({ errMsg }: { errMsg?: string }) {
  const { mutate } = useMutation({
    mutationFn: () => generateAndSendEmailVerificationCode(),
    onSuccess: () => {
      toast.custom(
        (t) => {
          const closeToast = () => {
            toast.dismiss(t);
            redirect("/");
          };
          return (
            <ToastBox
              variant="info"
              title="Verification code sent!"
              handleClose={closeToast}
              message=" We've sent the verification link to your email, click the link in your email to verify your account"
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
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <p className=" font-poppins text-lg text-white">
        {errMsg?.split(" ").slice(2).join(" ") ||
          "Oops! something went wrong. regenerate Verification link."}
      </p>
      <Button
        onClick={() => {
          // resend verification email
          mutate();
        }}
        className="bg-[#6D54B5] hover:bg-[#6132ec] uppercase rounded text-white  font-semibold  text-center px-6 py-5  "
      >
        Resend Verification Email
      </Button>
    </div>
  );
}

export default RegenerateVerificationLink;
