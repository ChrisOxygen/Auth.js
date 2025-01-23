import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import UserModel from "./database/models/user.model";

import bcrypt from "bcryptjs";

import { connectToDatabase } from "./database";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid email or password";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // credentials: {
      //   email: { label: "Email", type: "email", placeholder: "admin@new.com" },
      //   password: { label: "Password", type: "password", placeholder: "admin" },
      // },
      // async because you will need to make a request to your API to validate the credentials
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        console.log("credentials", email, password);
        // Make a request to your API to validate the credentials

        await connectToDatabase();

        const user = await UserModel.findOne({ email: email });
        if (!user) {
          throw new InvalidLoginError();
        }

        const isValid = bcrypt.compareSync(password, user.password!);

        if (!isValid) {
          throw new InvalidLoginError();
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          isVerified: user.verified,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
});
