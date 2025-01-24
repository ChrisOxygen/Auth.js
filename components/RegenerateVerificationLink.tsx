"use client";

import React from "react";
import { Button } from "./ui/button";
import { generateAndSendEmailVerificationCode } from "@/actions/user.action";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { toast } from "sonner";

import { FiX } from "react-icons/fi";

function RegenerateVerificationLink({
  userId,
  errMsg,
}: {
  userId: string;
  errMsg?: string;
}) {
  const { mutate } = useMutation({
    mutationFn: () => generateAndSendEmailVerificationCode(userId),
    onSuccess: () => {
      toast.custom(
        (t) => {
          return (
            <div className="flex relative flex-col justify-center gap-2 text-gray-900 font-poppins px-5 py-3 rounded-2xl overflow-hidden items-start ">
              <h4 className="text-gray-900 font-poppins font-bold text-lg">
                Check Your Email!
              </h4>
              <p className="text-gray-900 font-poppins">
                We&apos;ve sent the verification link to your email
              </p>
              <button
                onClick={() => {
                  toast.dismiss(t);
                  redirect("/");
                }}
                className="size-7 rounded-full bg-gray-900 text-xl absolute top-3 right-3"
              >
                <span className="grid place-items-center">
                  <FiX />
                </span>
              </button>
            </div>
          );
        },
        {
          unstyled: true,
          onAutoClose: (t) => {
            toast.dismiss(t.id);
            redirect("/");
          },

          classNames: {
            toast:
              "bg-white rounded-xl shadow-lg flex flex-col justify-center gap-2 text-gray-900 font-poppinsrounded-2xl overflow-hidden items-start",
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
