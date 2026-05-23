interface AccessRowProps {
  chips: string[];
}

export default function AccessRow({ chips }: AccessRowProps) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {chips.map((chip, i) =>
        chip.startsWith("→") ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: chips may contain duplicate arrow symbols, so index is needed for uniqueness
          <span key={`${chip}-${i}`} className="text-[10px] text-stone-400 dark:text-muted-foreground/70">
            {chip}
          </span>
        ) : (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: chips may contain duplicate place names in rare cases, index ensures uniqueness
            key={`${chip}-${i}`}
            className="flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[10.5px] text-sky-700"
          >
            📍 {chip}
          </span>
        ),
      )}
    </div>
  );
}
