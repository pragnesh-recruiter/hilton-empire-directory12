import React from "react";
export default function SearchBar({value, onChange, placeholder}) {
  return (
    <input
      className="w-full p-3 rounded border card"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder || "Search..."}
    />
  );
}
