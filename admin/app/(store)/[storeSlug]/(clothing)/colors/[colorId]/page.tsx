import React from "react";
import ColorForm from "./color-form";

type Props = {};

const ColorPage = ({}: Props) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm />
      </div>
    </div>
  );
};

export default ColorPage;
