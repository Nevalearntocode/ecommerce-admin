import React from "react";
import ModelClient from "./model-client";

type Props = {};

const Models = ({}: Props) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ModelClient />
      </div>
    </div>
  );
};

export default Models;
