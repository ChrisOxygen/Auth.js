"use client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import ToastBox from "./ToastBox";
import { generateAndSendEmailVerificationCode } from "@/actions/user.action";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

function NotificationBar() {
  const { data: session } = useSession();
  const { mutate } = useMutation({
    mutationFn: () =>
      generateAndSendEmailVerificationCode(session?.user?.id as string),
    onSuccess: () => {
      toast.custom(
        (t) => {
          const closeToast = () => {
            toast.dismiss(t);
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
    <div className=" bg-red-500 flex items-center md:flex-row flex-col justify-center w-full p-2  gap-2">
      <span className=" flex font-poppins  items-center gap-2">
        Click the link in your email to verify your accout, or
      </span>
      <Button
        onClick={() => {
          mutate();
        }}
        className=" font-semibold uppercase bg-red-700 hover:bg-red-900 px-6 ml-3"
      >
        Resend Verification Email
      </Button>
    </div>
  );
}

export default NotificationBar;
