import React from "react";
import SettingsForm from "./settings-form";

type Props = {};

const Settings = ({}: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm />
      </div>
    </div>
  );
};

export default Settings;
