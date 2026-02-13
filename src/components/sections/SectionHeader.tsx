import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  tag: string;
  title: string;
  titleAccent?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  tagClassName?: string;
  titleClassName?: string;
  accentClassName?: string;
  descriptionClassName?: string;
}

export function SectionHeader({
  tag,
  title,
  titleAccent,
  description,
  align = "center",
  className,
  tagClassName,
  titleClassName,
  accentClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-3xl text-center" : "text-left",
        className,
      )}
    >
      <span
        className={cn(
          "text-sm font-medium uppercase tracking-wider text-gray-600",
          tagClassName,
        )}
      >
        {tag}
      </span>

      <h2
        className={cn(
          "mt-4 mb-6 text-4xl tracking-tight text-gray-900 sm:text-5xl lg:text-6xl",
          titleClassName,
        )}
      >
        {title}
        {titleAccent ? (
          <>
            <br />
            <span className={cn("text-gray-500", accentClassName)}>
              {titleAccent}
            </span>
          </>
        ) : null}
      </h2>

      {description ? (
        <p
          className={cn(
            "text-lg leading-relaxed text-gray-600",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
