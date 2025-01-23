"use client";

import { FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { TbBrandGithubFilled } from "react-icons/tb";

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
import { Separator } from "./ui/separator";
import { LoadingSpinner } from "./LoadSpinner";
import { signInUser, signUp } from "@/actions/user.action";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

const signUpDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const signInDefaultValues = {
  email: "",
  password: "",
};

type AuthFormProps = {
  formType: "sign in" | "sign up";
};

const authFormSchema = (formType: "sign in" | "sign up") => {
  return z.object({
    email: z.string().email({
      message: "Invalid email address.",
    }),
    password: z.string().min(5, {
      message: "Password must be at least 5 characters.",
    }),
    firstName:
      formType === "sign up"
        ? z
            .string()
            .min(2, {
              message: "First name must be at least 2 characters.",
            })
            .max(30, {
              message: "First name must be at most 30 characters.",
            })
        : z.string().optional(),
    lastName:
      formType === "sign up"
        ? z
            .string()
            .min(2, {
              message: "Last name must be at least 2 characters.",
            })
            .max(30, {
              message: "Last name must be at most 30 characters.",
            })
        : z.string().optional(),
  });
};

function AuthForm({ formType }: AuthFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (values: SignUpDetails | SignInDetails) => {
      if (formType === "sign up") {
        return signUp(values as SignUpDetails);
      }
      return signInUser(values as SignInDetails);
    },
    onSuccess: () => {
      if (formType === "sign up") {
        router.push("/sign-in");
      }
      if (formType === "sign in") {
        router.push("/");
      }
    },
    onError: (error) => {
      // An error happened!
      console.log("searchParams", searchParams.get("code"), error);

      if (error.message === "Invalid email or password") {
        form.setError(
          "root" as "email" | "password" | "firstName" | "lastName" | "root",
          {
            type: "manual",
            message: error.message,
          }
        );
      } else {
        const msgArr = error.message.split(" ");
        const errMsg = `${msgArr.slice(2).join(" ")}`;
        form.setError(
          msgArr[1] as "email" | "password" | "firstName" | "lastName",
          {
            type: "manual",
            message: errMsg,
          }
        );
      }
    },
  });
  const formDefaultValues =
    formType === "sign in" ? signInDefaultValues : signUpDefaultValues;
  // 1. Define a form schema.
  const formSchema = authFormSchema(formType);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (formType === "sign up") {
      const signUpDetails: SignUpDetails = {
        email: values.email,
        password: values.password,
        firstName: values.firstName!,
        lastName: values.lastName!,
      };

      mutate(signUpDetails);
    }

    if (formType === "sign in") {
      const signInDetails: SignInDetails = {
        email: values.email,
        password: values.password,
      };

      mutate(signInDetails);
    }
  }

  // const errorMsg = form.formState.errors;
  const loading =
    form.formState.isSubmitting || form.formState.isValidating || isPending;

  const submitText = formType === "sign in" ? "Sign in" : "Create account";
  return (
    <div className="bg-[#2C2638] w-full h-screen flex-col sm:flex-row  p-5 flex gap-5">
      <div
        className=" min-w-[400px] lg:basis-1/2 shrink grid h-[260px] sm:h-full rounded-2xl  p-5  "
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
        <div className=" md:px-[50px] px-[20px]  lg:px-[100px] mx-auto w-full flex flex-col gap-5">
          <h2 className="text-white text-4xl font-thin">
            {formType === "sign in" ? "Sign in" : "Create account"}
          </h2>
          {formType === "sign in" ? (
            <>
              <p className="text-white/40 font-poppins ">
                Don&apos;t have an account?{" "}
                <Link className="text-[#6D54B5]" href={"/sign-up"}>
                  Create an account
                </Link>{" "}
              </p>
            </>
          ) : (
            <>
              <p className="text-white/40 font-poppins ">
                Already have an account?{" "}
                <Link className="text-[#6D54B5]" href={"/sign-in"}>
                  Login
                </Link>{" "}
              </p>
            </>
          )}
          <Form {...form}>
            <form
              className="
             flex flex-col gap-5"
            >
              {formType === "sign up" ? (
                <>
                  <div className="flex gap-5">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className=" basis-1/2">
                          <FormControl>
                            <Input
                              className="py-[26px] !bg-[#3C364C] text-lg active:outline focus-visible:outline outline-[#6D54B5] border-none   focus:outline-[#6D54B5] active:bg:[#3C364C] focused:bg:[#3C364C]"
                              type="text"
                              placeholder="First Name"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className=" basis-1/2">
                          <FormControl>
                            <Input
                              className="py-[26px] !bg-[#3C364C] text-lg active:outline focus-visible:outline outline-[#6D54B5] border-none   focus:outline-[#6D54B5] active:bg:[#3C364C] focused:bg:[#3C364C]"
                              type="text"
                              placeholder="Last Name"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="py-[26px] !bg-[#3C364C] text-lg active:outline focus-visible:outline outline-[#6D54B5] border-none   focus:outline-[#6D54B5] active:bg:[#3C364C] focused:bg:[#3C364C]"
                            type="password"
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <>
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="py-[26px] !bg-[#3C364C] text-lg active:outline focus-visible:outline outline-[#6D54B5] border-none   focus:outline-[#6D54B5] active:bg:[#3C364C] focused:bg:[#3C364C]"
                            type="password"
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)();
                }}
                className=" text-lg font-poppins text-center  transition-all  bg-[#6D54B5] hover:bg-[#6132ec] py-[26px] capitalize"
              >
                {submitText}{" "}
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
            {formType === "sign in" && (
              <Link href="/forgot-password" className="text-[#6D54B5]">
                Forgot password?
              </Link>
            )}
          </Form>
          <div className="flex flex-col gap-5 w-full">
            <div className="flex items-center gap-5 text-white/10">
              <Separator
                orientation="horizontal"
                className="bg-white/40 shrink"
              />
              <span className=" text-white/40 shrink-0">
                Or {formType} with
              </span>
              <Separator
                orientation="horizontal"
                className="bg-white/40 shrink"
              />
            </div>
            <div className="flex w-full gap-5">
              <Button className=" py-6 basis-1/2 flex items-center gap-1 font-poppins capitalize bg-transparent border border-white/30">
                <span className=" text-5xl">
                  <FcGoogle />
                </span>
                <span>Google</span>
              </Button>
              <Button className=" py-6 basis-1/2 flex items-center gap-1 font-poppins capitalize bg-transparent border border-white/30">
                <TbBrandGithubFilled />
                <span>Git Hub</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
