import React from "react";
import RegisterForm from "./register-form";
import Image from "next/image";

type Props = {};

const Register = async (props: Props) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-[380px] flex-col gap-y-8 pb-8 pt-8 lg:w-[540px] lg:px-20 xl:mr-auto xl:h-full xl:w-[30%] xl:justify-center xl:border-2">
        <h1 className="w-full text-center text-3xl font-bold">Register</h1>
        <RegisterForm />
      </div>
      <div className="hidden h-full w-[75%] items-center justify-center bg-muted xl:flex">
        <Image
          src="/admin-dashboard.png"
          alt="Image"
          width="1600"
          height="900"
          className="aspect-video h-5/6 w-5/6 dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Register;
