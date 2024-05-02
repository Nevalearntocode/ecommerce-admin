import React from "react";
import SizeForm from "./size-form";

type Props = {};

const SizePage = ({}: Props) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm />
      </div>
    </div>
  );
};

export default SizePage;
