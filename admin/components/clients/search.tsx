import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

type Props = {
  onChange: (value: string) => void;
  component: string;
  noName?: boolean;
};

const SearchInput = ({ onChange, component, noName }: Props) => {
  return (
    <div className="relative">
      <Input
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Search ${component} by ${noName ? "phone number" : "name"}...`}
      />
      <Button
        className="absolute right-0 top-0 rounded-full"
        variant={`ghost`}
        size={`icon`}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchInput;
