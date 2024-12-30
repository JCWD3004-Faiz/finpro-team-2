import React from 'react';

interface SelectFilterProps {
  label: string;
  value: string;
  options: { value: string, label: string }[];
  onChange: (value: string) => void;
}

const SelectFilter: React.FC<SelectFilterProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="mb-4">
      <select
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md"
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectFilter;
