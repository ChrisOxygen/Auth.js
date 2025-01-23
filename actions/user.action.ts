"use server";

import { connectToDatabase } from "@/database";
import UserModel from "@/database/models/user.model";

import bcrypt from "bcryptjs";

import { handleServerErrors } from "@/lib/utils";
import { signIn } from "@/auth";

export const signUp = async (signupDetails: SignUpDetails) => {
  const { firstName, lastName, email, password } = signupDetails;
  const name = `${firstName} ${lastName}`;

  try {
    connectToDatabase();

    // check if user already exists

    const userExists = await UserModel.findOne({
      email,
    });

    if (userExists) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "User exists already!";
      error.field = "email";
      error.status = 409;
      throw error;
    }

    // hash the password

    const hashedPw = await bcrypt.hash(password, 12);

    if (!hashedPw) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Password hashing failed!";
      error.status = 500;
      throw error;
    }

    // Create a new user

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPw,
      provider: "credentials",
    });

    console.log("New user created: ", newUser);

    return newUser ? JSON.parse(JSON.stringify(newUser)) : null;

    // return redirect("/sign-in");
  } catch (error) {
    handleServerErrors(error as ErrorWithMessageAndStatus);
  }
};

export const signInUser = async (data: SignInDetails) => {
  // remember to import the signIn function not from next-auth/react but from "@/auth"
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
