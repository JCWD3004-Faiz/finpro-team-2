import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'; // Import shadcn components

interface SelectFilterProps {
  label: string;
  value: string;
  options: { value: string, label: string }[];
  onChange: (value: string) => void;
}

const SelectFilter: React.FC<SelectFilterProps> = ({ label, value, options, onChange }) => {
  // This is to clear the selection without causing errors
  const handleClearSelection = () => {
    onChange(""); // or use `null` if you prefer to use null to represent empty state
  };

  return (
    <div className="mb-4">
      <Select value={value} onValueChange={(newValue:any) => {
        // Only call onChange if it's not the "clear" selection
        if (newValue === "none") {
          handleClearSelection(); // Clear the selection
        } else {
          onChange(newValue); // Proceed with normal selection
        }
      }}>
        <SelectTrigger className="bg-white p-2 border border-gray-300 rounded-md text-gray-800">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {/* Use a special value for clear */}
          <SelectItem value="none">
            {label} {/* This will be the placeholder item to clear the selection */}
          </SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectFilter;
