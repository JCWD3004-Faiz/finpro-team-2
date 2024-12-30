import React from 'react';
import { IoSearch } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface SearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  className: string;
  placeholder: string;
}

function SearchField({ searchTerm, onSearchChange, className, placeholder }: SearchProps) {
  return (
    <Card className={`p-4 w-full ${className}`}>
      <div className="relative w-full">
        <IoSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
        <Input
          placeholder={placeholder}
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </Card>
  );
}

export default SearchField;
