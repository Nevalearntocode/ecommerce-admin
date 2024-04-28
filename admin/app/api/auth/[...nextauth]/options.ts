import { db } from "@/lib/db";
import { NextAuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { Adapter } from "next-auth/adapters";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await db.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          throw new Error("User does not exist.");
        }
        if (!user.hashedPassword) {
          throw new Error("You have created an account with Google.");
        }

        const isCorrectPassword = await bcrypt.compare(
          password,
          user.hashedPassword,
        );

        if (!isCorrectPassword) {
          throw new Error("Wrong password.");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
