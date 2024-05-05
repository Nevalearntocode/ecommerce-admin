import React from "react";
import Image from "next/image";
import LoginForm from "./login-form";

type Props = {};

const Login = async (props: Props) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-[380px] flex-col gap-y-8 pb-8 pt-8 lg:w-[540px] lg:px-20 xl:mr-auto xl:h-full xl:w-[30%] xl:justify-center xl:border-2">
        <h1 className="w-full text-center text-3xl font-bold">Login</h1>
        <LoginForm />
      </div>
      <div className="hidden h-full items-center justify-center bg-muted dark:bg-black xl:flex">
        <div className="relative mx-16 my-16 flex aspect-[2.1/1] h-[65%] min-h-[400px] w-full items-center justify-center rounded-lg border-4 bg-gradient-to-br from-black to-gray-700 text-3xl">
          <h1 className="absolute rounded-full px-3 py-2 text-2xl font-bold italic text-white md:text-3xl xl:text-4xl">
            One Platform. Unlimited Possibilites.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
