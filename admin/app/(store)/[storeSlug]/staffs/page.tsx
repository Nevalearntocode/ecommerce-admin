import React from "react";
import StaffClient from "./staff-client";

type Props = {};

const Staffs = ({}: Props) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <StaffClient />
      </div>
    </div>
  );
};

export default Staffs;
