"use client";

import { Button } from "@/components/ui/button";
import useModal from "@/hooks/use-modal-store";
import { signOut } from "next-auth/react";
import React from "react";

type Props = {};

const HomePage = (props: Props) => {
  const { open } = useModal();

  return (
    <div className="relative mx-4 my-8 flex aspect-auto h-screen items-center justify-center rounded-lg border-4 bg-gradient-to-br from-black to-gray-700 text-3xl md:mx-8 md:mt-12 md:min-h-[280px] lg:mx-12 lg:min-h-[360px] xl:mx-16 xl:aspect-[2.4/1] xl:h-auto xl:min-h-[400px]">
      <h1 className="absolute rounded-full px-3 py-2 text-2xl font-bold italic text-white md:text-3xl xl:text-4xl">
        One Platform. Unlimited Possibilites.
      </h1>
      <div className="absolute right-2 top-2 flex gap-x-4">
        <Button variant={`outline`} onClick={() => open("createStore")}>
          Create store
        </Button>
        <Button variant={`outline`} onClick={() => signOut()}>
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
