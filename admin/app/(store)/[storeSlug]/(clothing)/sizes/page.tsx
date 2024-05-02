import React from "react";
import SizeClient from "./size-client";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Sizes = ({}: Props) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient />
      </div>
    </div>
  );
};

export default Sizes;
