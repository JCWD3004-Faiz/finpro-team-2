import React from 'react'
import { IoSearch } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface SearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

function SearchField({searchTerm, onSearchChange}: SearchProps) {
  return (
    <Card className="p-4">
    <div className="flex gap-4">
      <div className="relative flex-1">
        <IoSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
        <Input
          placeholder="Search products..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  </Card>
  )
}

export default SearchField