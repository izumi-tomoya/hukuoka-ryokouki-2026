interface AccessRowProps {
  chips: string[];
}

export default function AccessRow({ chips }: AccessRowProps) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {chips.map((chip, i) =>
        chip.startsWith("→") ? (
          <span key={i} className="text-[10px] text-stone-400">
            {chip}
          </span>
        ) : (
          <span
            key={i}
            className="flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[10.5px] text-sky-700"
          >
            📍 {chip}
          </span>
        )
      )}
    </div>
  );
}
