import React from "react";
import CategoryClient from "./category-client";

type Props = {};

const Categories = async ({}: Props) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient />
      </div>
    </div>
  );
};

export default Categories;
