import React from "react";
import ColorClient from "./color-client";


const Colors =  () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient />
      </div>
    </div>
  );
};

export default Colors;
