"use client";

import React, { useEffect, useState } from "react";
import ProfileModal from "../modals/profile-modal";
import CreateStoreModal from "../modals/create-store-modal";
import ConfirmDeleteModal from "../modals/confirm-delete";
import UpdateRoleModal from "../modals/update-role-modal";
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
      <UpdateRoleModal />
    </>
  );
};

export default ModalProvider;
