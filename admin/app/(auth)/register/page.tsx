import React from "react";
import RegisterForm from "./register-form";
import Image from "next/image";

type Props = {};

const Register = (props: Props) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="xl:w-[30%] w-[380px] lg:px-20 pt-8 pb-8 lg:w-[540px] xl:border-2 flex flex-col gap-y-8 xl:mr-auto xl:h-full xl:justify-center">
        <h1 className="w-full text-center text-3xl font-bold">Register</h1>
        <RegisterForm />
      </div>
      <div className="hidden bg-muted xl:flex w-[75%] items-center justify-center h-full">
        <Image
          src="/celestial.png"
          alt="Image"
          width="1600"
          height="900"
          className="h-5/6 w-5/6 object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Register;
