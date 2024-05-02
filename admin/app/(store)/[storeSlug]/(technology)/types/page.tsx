import React from "react";
import TypeClient from "./type-client";

type Props = {};

const Types = ({}: Props) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TypeClient />
      </div>
    </div>
  );
};

export default Types;
