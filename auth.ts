import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import UserModel from "./database/models/user.model";
import { JWT } from "next-auth/jwt";

import bcrypt from "bcryptjs";

import { connectToDatabase } from "./database";

declare module "next-auth" {
  interface Session {
    user: SessionUserProfile;
  }
}

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid email or password";
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
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
          name: user.name,
          avatar: user.avatar?.url || "default_avatar.png",
          email: user.email,
          isVerified: user.verified,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token = { ...token, ...user };
      }
      if (trigger === "update") {
        token = { ...token, ...session };
      }
      return token;
    },
    session({ session, token }) {
      let user = token as typeof token & SessionUserProfile;

      if (token.user) {
        user = token.user as JWT & SessionUserProfile;
      }

      if (user) {
        session.user = {
          ...session.user,
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          isVerified: user.isVerified,
        };
      }

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
});
