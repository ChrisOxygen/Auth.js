"use server";

import { connectToDatabase } from "@/database";
import UserModel from "@/database/models/user.model";

import { v4 as uuidv4 } from "uuid";

import bcrypt from "bcryptjs";

import { handleServerErrors } from "@/lib/utils";
import { auth, signIn, unstable_update } from "@/auth";
import verificationCodeModel from "@/database/models/verificationCode.model";
import { revalidatePath } from "next/cache";
import PasswordCodeModel from "@/database/models/passwordCode.model";

export const generateAndSendEmailVerificationCode = async (
  userId: string
): Promise<{ succes: boolean } | null | undefined> => {
  try {
    connectToDatabase();

    console.log("userId", userId);

    const newUser = await UserModel.findById(userId);

    if (!newUser) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "User not found!";
      error.status = 404;
      throw error;
    }

    const vCode = uuidv4();

    const hashedVcode = await bcrypt.hash(vCode, 12);

    await verificationCodeModel.deleteOne({ userId });

    const newVcode = await verificationCodeModel.create({
      userId,
      hashedCode: hashedVcode,
    });

    if (!newVcode) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Verification code creation failed!";
      error.status = 500;
      throw error;
    }

    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?code=${vCode}`;

    const emailResponse = await fetch(
      `${process.env.NEXTAUTH_URL}/api/verify-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUser.name,
          verificationLink: verificationLink,
          email: newUser.email,
        }),
      }
    );

    return newVcode && emailResponse.ok
      ? JSON.parse(JSON.stringify({ success: true }))
      : null;
  } catch (error) {
    handleServerErrors(error as ErrorWithMessageAndStatus);
  }
};

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

    // create verification code

    const newVcode = await generateAndSendEmailVerificationCode(
      newUser._id.toString()
    );

    if (!newVcode) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Verification code creation failed!";
      error.status = 500;
      throw error;
    }

    return newUser ? JSON.parse(JSON.stringify(newUser)) : null;

    // return redirect("/sign-in");
  } catch (error) {
    handleServerErrors(error as ErrorWithMessageAndStatus);
  }
};

export const signInUser = async (data: SignInDetails) => {
  // remember to import the signIn function not from next-auth/react but from "@/auth"

  console.log("data", data);

  // const signedIn = await signIn("credentials", {
  //   email: data.email,
  //   password: data.password,
  //   redirect: false,
  // });

  // if (signedIn && signedIn.error) {
  //   throw new Error(signedIn.code);
  // }

  // console.log("signedIn", signedIn);

  try {
    const signedIn = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    console.log("signedIn", signedIn);

    if (signedIn && signedIn.error) {
      throw new Error(signedIn.code);
    }
  } catch (err) {
    const error = new Error() as ErrorWithMessageAndStatus;
    error.message = "Invalid email or password!";
    error.status = 400;

    handleServerErrors(error as ErrorWithMessageAndStatus);
  }
};

export const verifyUserEmail = async (code: string, userId: string) => {
  try {
    connectToDatabase();
    const verificationCode = await verificationCodeModel.findOne({
      userId,
    });

    if (!verificationCode) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Invalid verification code!";
      error.status = 400;
      throw error;
    }

    const isMatch = await bcrypt.compare(code, verificationCode.hashedCode);

    if (!isMatch) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Invalid verification code!";
      error.status = 400;
      throw error;
    }

    const timeOut =
      new Date().getTime() - new Date(verificationCode.createdAt!).getTime() >
      1000 * 60 * 10;

    if (timeOut) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Verification code expired!";
      error.status = 400;
      throw error;
    }

    await verificationCodeModel.deleteOne({
      userId,
    });

    const user = await UserModel.findByIdAndUpdate(userId, {
      verified: true,
    });

    if (!user) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "User not found!";
      error.status = 404;
      throw error;
    }

    console.log("user", user);

    const session = await auth();

    if (!session) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Session not found!";
      error.status = 404;
      throw error;
    }

    console.log("session", session);

    const updatedSession = await unstable_update({
      user: { ...session.user, isVerified: true },
    });

    if (!updatedSession) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Session update failed!";
      error.status = 500;
      throw error;
    }

    revalidatePath("/");

    return JSON.parse(JSON.stringify({ success: true }));
  } catch (error) {
    handleServerErrors(error as ErrorWithMessageAndStatus);
  }
};

export const generateAndSendPasswordResetCode = async (email: string) => {
  try {
    connectToDatabase();

    const user = await UserModel.findOne({ email });

    if (!user) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "User not found!";
      error.status = 404;
      throw error;
    }

    const vCode = uuidv4();

    const hashedVcode = await bcrypt.hash(vCode, 12);

    await PasswordCodeModel.deleteOne({ userId: user._id.toString() });

    const newVcode = await PasswordCodeModel.create({
      userId: user._id.toString(),
      hashedCode: hashedVcode,
    });

    if (!newVcode) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Password reset code creation failed!";
      error.status = 500;
      throw error;
    }

    const passwordResetLink = `${process.env.NEXTAUTH_URL}/reset-password?code=${vCode}`;

    const emailResponse = await fetch(
      `${process.env.NEXTAUTH_URL}/api/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          passwordResetLink: passwordResetLink,
          email: user.email,
        }),
      }
    );

    return newVcode && emailResponse.ok
      ? JSON.parse(JSON.stringify({ success: true }))
      : null;
  } catch (error) {
    handleServerErrors(error as ErrorWithMessageAndStatus);
  }
};

export const SetNewPassword = async (setPasswordValues: {
  code: string;
  email: string;
  newPassword: string;
}) => {
  const { code, email, newPassword } = setPasswordValues;

  try {
    connectToDatabase();

    const user = await UserModel.findOne({ email });

    if (!user) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "User not found!";
      error.status = 404;
      throw error;
    }

    console.log("user", user);

    const passwordCode = await PasswordCodeModel.findOne({
      userId: user._id.toString(),
    });

    if (!passwordCode) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Invalid password reset code!";
      error.status = 400;
      throw error;
    }

    console.log("passwordCode", passwordCode);

    const isMatch = await bcrypt.compare(code, passwordCode.hashedCode);

    if (!isMatch) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Invalid password reset code!";
      error.status = 400;
      throw error;
    }

    const timeOut =
      new Date().getTime() - new Date(passwordCode.createdAt!).getTime() >
      1000 * 60 * 10;

    if (timeOut) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Password reset code expired!";
      error.status = 400;
      throw error;
    }

    await passwordCode.deleteOne({
      userId: user._id.toString(),
    });

    const hashedPw = await bcrypt.hash(newPassword, 12);

    if (!hashedPw) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Password hashing failed!";
      error.status = 500;
      throw error;
    }

    await UserModel.findByIdAndUpdate(user._id.toString(), {
      password: hashedPw,
    });

    return JSON.parse(JSON.stringify({ success: true }));
  } catch (error) {
    handleServerErrors(error as ErrorWithMessageAndStatus);
  }
};
