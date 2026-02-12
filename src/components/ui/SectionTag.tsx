import type React from "react";

interface SectionTagProps {
  children: React.ReactNode;
}

export default function SectionTag({ children }: SectionTagProps) {
  return (
    <div className="flex items-center justify-center mb-4">
      <span className="inline-flex items-center rounded-full border border-gray-300/80 bg-white/80 px-4 py-2 text-xs font-semibold text-gray-700 uppercase tracking-[0.2em] backdrop-blur-sm sm:text-sm">
        {children}
      </span>
    </div>
  );
}
