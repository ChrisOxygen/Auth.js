"use client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import ToastBox from "./ToastBox";
import { generateAndSendEmailVerificationCode } from "@/actions/user.action";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "./LoadSpinner";
import { useEffect, useState } from "react";

function NotificationBar() {
  const [emailSent, setEmailSent] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const { data: session } = useSession();
  const { mutate, isPending } = useMutation({
    mutationFn: () => generateAndSendEmailVerificationCode(),
    onSuccess: () => {
      setEmailSent(true);
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

  useEffect(() => {
    if (emailSent) {
      setIsButtonDisabled(true);
      setRemainingTime(4 * 60); // 4 minutes in seconds
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsButtonDisabled(false);
            setEmailSent(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [emailSent]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  console.log("session", session?.user.id);
  return (
    <div className=" bg-red-500 flex items-center md:flex-row flex-col justify-center w-full p-2  gap-2">
      <span className=" flex font-poppins  items-center gap-2">
        Click the link in your email to verify your accout, or
      </span>
      <Button
        disabled={isButtonDisabled}
        onClick={() => {
          mutate();
        }}
        className=" font-semibold w-[300px] uppercase bg-red-700 hover:bg-red-900 px-6 ml-3"
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <span className="">Generating email</span>
            <LoadingSpinner />
          </div>
        ) : isButtonDisabled ? (
          `Resend in ${formatTime(remainingTime)}`
        ) : (
          "Resend Verification Email"
        )}
      </Button>
    </div>
  );
}

export default NotificationBar;
