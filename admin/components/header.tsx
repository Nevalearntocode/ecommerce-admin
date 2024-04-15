import React from "react";

type Props = {
  title: string;
  description: string;
};

const Header = ({ description, title }: Props) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Header;
