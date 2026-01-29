import React from "react";

interface SectionTagProps {
  children: React.ReactNode;
}

export default function SectionTag({ children }: SectionTagProps) {
  return (
    <div className="flex items-center justify-center mb-4">
      <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full border border-blue-100">
        {children}
      </span>
    </div>
  );
}
