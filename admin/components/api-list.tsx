"use client";

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import React from "react";
import APIAlert from "./api-alert";

type Props = {
  name: string;
  id: string;
};

const APIList = ({ id, name }: Props) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/store/${params.storeSlug}`;

  return (
    <>
      <APIAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${name}`}
      />
      <APIAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${name}/[${id}]`}
      />
      <APIAlert
        title="POST"
        variant="staff"
        description={`${baseUrl}/${name}/[${id}]`}
      />
      <APIAlert
        title="PATCH"
        variant="staff"
        description={`${baseUrl}/${name}/[${id}]`}
      />
      <APIAlert
        title="DELETE"
        variant="staff"
        description={`${baseUrl}/${name}/[${id}]`}
      />
    </>
  );
};

export default APIList;
