import React from "react";

type Props = {
  title: string;
  description: string;
};

const Header = ({ description, title }: Props) => {
  return (
    <div className="flex flex-col">
      <h2 className="line-clamp-1 font-bold tracking-tight md:text-3xl">
        {title}
      </h2>
      <p className="hidden text-sm text-muted-foreground md:block">
        {description}
      </p>
    </div>
  );
};

export default Header;
