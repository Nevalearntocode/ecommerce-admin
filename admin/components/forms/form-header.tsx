import React from "react";
import Header from "@/components/header";
import ButtonActions from "./button-action";

type Props = {
  title: string;
  description: string;
  isLoading: boolean;
  isEditing: boolean;
  onDelete: () => void;
  onSubmit: () => void;
};

const FormHeader = ({
  title,
  description,
  isLoading,
  isEditing,
  onDelete,
  onSubmit,
}: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div className="md:block">
        <Header title={title} description={description} />
      </div>
      <ButtonActions
        isLoading={isLoading}
        isEditing={isEditing}
        onDelete={onDelete}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default FormHeader;
