"use client";

import React, { useEffect, useState } from "react";
import ProfileModal from "../modals/profile-modal";
type Props = {};

const ModalProvider = (props: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <ProfileModal />
    </>
  );
};

export default ModalProvider;
