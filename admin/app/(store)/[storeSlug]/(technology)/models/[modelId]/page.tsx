import React from "react";
import ModelForm from "./model-form";
type Props = {};

const ModelPage = ({}: Props) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ModelForm />
      </div>
    </div>
  );
};

export default ModelPage;
