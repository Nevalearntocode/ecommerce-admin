// components/shared/HeaderWithActions.jsx

import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { cn } from "@/lib/utils";
import ActionTooltip from "./action-tooltip";
import { Image as ImageIcon, Table } from "lucide-react";

interface HeaderWithActionsProps {
  title: string;
  description: string;
  actions?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    tooltip?: string;
    active?: boolean;
  }[];
  viewState?: string | null;
  onCardView?: () => void;
  onDataView?: () => void;
}

const HeaderWithActions = ({
  description,
  title,
  actions,
  onCardView,
  onDataView,
  viewState,
}: HeaderWithActionsProps) => {
  return (
    <div className="flex items-center justify-between">
      <Header title={title} description={description} />
      <div className="flex gap-x-4">
        {viewState && onCardView && (
          <>
            <ActionTooltip tooltip="Switch to image view">
              <Button
                onClick={onCardView}
                variant={`ghost`}
                size={`icon`}
                className={cn(
                  "flex items-center justify-center",
                  viewState === "card" && "bg-black/15",
                )}
              >
                {/* Replace with your Image icon component */}
                <ImageIcon className="h-1/2 w-1/2" />
              </Button>
            </ActionTooltip>
            <ActionTooltip tooltip="Switch to datatable view">
              <Button
                onClick={onDataView}
                variant={`ghost`}
                size={`icon`}
                className={cn(
                  "flex items-center justify-center",
                  viewState === "datatable" && "bg-black/15",
                )}
              >
                {/* Replace with your Table icon component */}
                <Table className="h-1/2 w-1/2" />
              </Button>
            </ActionTooltip>
          </>
        )}
        {actions?.map((action) => (
          <Button onClick={action.onClick} key={action.label}>
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default HeaderWithActions;
