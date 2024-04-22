import React from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

type Props = {
  isLoading: boolean;
  isEditing: boolean;
  onDelete: () => void;
  onSubmit: () => void;
};

const ButtonActions = ({ isLoading, isEditing, onDelete, onSubmit }: Props) => {
  return (
    <div className="flex gap-x-4">
      {isEditing && (
        <Button
          className="md:h-10 md:w-32"
          disabled={isLoading}
          variant={`destructive`}
          size={`sm`}
          onClick={onDelete}
        >
          Delete
          <Trash className="ml-2 h-4 w-4" />
        </Button>
      )}
      <Button
        className="ml-auto flex md:h-10 md:w-32"
        size={"sm"}
        disabled={isLoading}
        type="submit"
        onClick={onSubmit}
      >
        {isEditing ? "Save changes" : "Save"}
      </Button>
    </div>
  );
};

export default ButtonActions;
