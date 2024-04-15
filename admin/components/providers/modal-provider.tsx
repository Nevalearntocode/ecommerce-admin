"use client";

import React, { useEffect, useState } from "react";
import ProfileModal from "../modals/profile-modal";
import CreateStoreModal from "../modals/create-store-modal";
import ConfirmDeleteModal from "../modals/confirm-delete";
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
      <CreateStoreModal />
      <ConfirmDeleteModal />
    </>
  );
};

export default ModalProvider;
