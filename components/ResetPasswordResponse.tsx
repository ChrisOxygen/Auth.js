"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { LoadingSpinner } from "@/components/LoadSpinner";
import { FiArrowRight } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { SetNewPassword } from "@/actions/user.action";
import ToastBox from "./ToastBox";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
});

function ResetPasswordResponse({
  verificationCode,
}: {
  verificationCode: string;
}) {
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", newPassword: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (setPasswordValues: {
      code: string;
      email: string;
      newPassword: string;
    }) => {
      return SetNewPassword(setPasswordValues);
    },
    onSuccess: () => {
      toast.custom(
        (t) => {
          const closeToast = () => {
            toast.dismiss(t);
            redirect("/sign-in");
          };
          return (
            <ToastBox
              variant="success"
              title="Password Changed!"
              handleClose={closeToast}
              message="Your password has been changed successfully. You can now login with your new password."
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
            redirect("/sign-in");
          },
          classNames: {
            toast: " bg-red-500 w-full",
          },
        }
      );
    },
    onError: (error) => {
      // An error happened!

      if (error.message === "Invalid email or password") {
        form.setError("root" as "email" | "root", {
          type: "manual",
          message: error.message,
        });
      } else {
        const msgArr = error.message.split(" ");
        const errMsg = `${msgArr.slice(2).join(" ")}`;
        form.setError(msgArr[1] as "email" | "root", {
          type: "manual",
          message: errMsg,
        });
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutate({
      code: verificationCode,
      email: values.email,
      newPassword: values.newPassword,
    });
  }

  if (session) {
    signOut({
      callbackUrl: `/reset-password?code=${verificationCode}`,
    });
  }

  const loading =
    form.formState.isSubmitting || form.formState.isValidating || isPending;
  return (
    <div className="bg-[#2C2638] w-full h-screen flex-col sm:flex-row  p-5 flex gap-5">
      <div
        className=" lg:basis-1/2 shrink grid h-[260px] sm:h-full rounded-2xl  p-5  "
        style={{
          backgroundImage: "url('/desert.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex  flex-col justify-between w-full">
          <nav className="flex text-white items-center justify-between">
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
          </nav>
          <div className=" w-full flex flex-col gap-5 items-center mb-2  ">
            <h4 className=" text-3xl capitalize text-center max-w-[400px] font-thin text-white">
              Auth.js , formerly <br /> known as NextAuth.js.
            </h4>
            <span className="h-[2px] w-[150px] bg-white rounded-lg"></span>
          </div>
        </div>
      </div>
      <div className=" w-full lg:w-0  lg:basis-1/2 shrink grid place-items-center">
        <div className=" md:px-[50px] px-0  lg:px-[100px] mx-auto w-full flex flex-col gap-5">
          <h2 className="text-white text-4xl font-thin">Reset your password</h2>
          <p className="text-white/40 font-poppins ">
            Enter your email address and new password.
          </p>
          <Form {...form}>
            <form
              className="
                 flex flex-col gap-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="py-[26px] !bg-[#3C364C] text-lg active:outline focus-visible:outline outline-[#6D54B5] border-none   focus:outline-[#6D54B5] active:bg:[#3C364C] focused:bg:[#3C364C]"
                        type=" email"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="py-[26px] !bg-[#3C364C] text-lg active:outline focus-visible:outline outline-[#6D54B5] border-none   focus:outline-[#6D54B5] active:bg:[#3C364C] focused:bg:[#3C364C]"
                        type="password"
                        placeholder="*****"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)();
                }}
                className=" text-lg font-poppins text-center  transition-all  bg-[#6D54B5] hover:bg-[#6132ec] py-[26px] capitalize"
              >
                set new password{" "}
                {loading && (
                  <span className=" ml-2">
                    <LoadingSpinner />
                  </span>
                )}
              </Button>
            </form>
            {form.formState.errors?.root && (
              <FormMessage>{form.formState.errors?.root?.message}</FormMessage>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordResponse;
