"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

interface MobileSectionLegendProps {
  sections: Array<{ id: string; title: string }>;
  label: string;
  ariaLabel: string;
}

export function MobileSectionLegend({
  sections,
  label,
  ariaLabel,
}: MobileSectionLegendProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50 lg:hidden">
      {isOpen ? (
        <button
          type="button"
          aria-label="Close sections"
          className="fixed inset-0 bg-black/15"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <div className="relative">
        {isOpen ? (
          <nav
            id="mobile-section-legend"
            aria-label={ariaLabel}
            className="absolute bottom-full left-0 mb-2 w-[min(82vw,320px)] rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg"
          >
            <ul className="max-h-[58vh] space-y-1 overflow-y-auto pr-1">
              {sections.map((section) => (
                <li key={`mobile-legend-${section.id}`}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-lg px-2.5 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                    onClick={() => setIsOpen(false)}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-neutral-200 bg-white px-4 text-neutral-800 shadow-sm hover:bg-neutral-50"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="mobile-section-legend"
        >
          {label}
        </Button>
      </div>
    </div>
  );
}
