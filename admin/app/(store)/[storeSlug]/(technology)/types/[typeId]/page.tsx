import React from "react";
import TypeForm from "./type-form";

type Props = {};

const TypePage = ({}: Props) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TypeForm />
      </div>
    </div>
  );
};

export default TypePage;
