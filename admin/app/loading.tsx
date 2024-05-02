import { Loader2 } from "lucide-react";
import React from "react";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="flex h-full justify-center pt-64">
      <Loader2 className="h-10 w-10 animate-spin transition" />
    </div>
  );
};

export default Loading;
