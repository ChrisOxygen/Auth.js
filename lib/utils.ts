import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CustomFormError } from "./errors";
import { signIn } from "@/auth";
// import { signIn } from "next-auth/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const signInUser = async (data: SignInDetails) => {
  const signedIn = await signIn("credentials", {
    email: data.email,
    password: data.password,
    redirect: false,
  });

  if (signedIn && signedIn.error) {
    throw new Error(signedIn.code);
  }

  console.log("signedIn", signedIn);
};

export function handleServerErrors(error: ErrorWithMessageAndStatus) {
  const customError = {
    message: error.message || "An error occurred",
    statusCode: error.status || 500,
    field: error.field || "root",
  } as CustomFormError;

  const errorString = `CM ${customError.field} ${customError.message}`;

  throw new Error(errorString);
}
