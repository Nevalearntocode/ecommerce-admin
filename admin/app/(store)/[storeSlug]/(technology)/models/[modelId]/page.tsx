import { getModelById } from "@/data/get-models";
import React from "react";
import ModelForm from "./model-form";
type Props = {
  params: {
    modelId: string;
    storeSlug: string;
  };
};

const ModelPage = async ({ params }: Props) => {
  const model = await getModelById(params.modelId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ModelForm model={model} />
      </div>
    </div>
  );
};

export default ModelPage;
