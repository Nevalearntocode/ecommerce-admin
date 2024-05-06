"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const logIn = async (data: { email: string; password: string }) => {
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: error.cause?.err?.message,
      };
    }
    throw error;
  }
};

export default logIn;
