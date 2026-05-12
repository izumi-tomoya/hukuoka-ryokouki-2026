"use client";

import { Calendar, FileText, Loader2, MapPin, Palette, Save, Sparkles, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTrip, deleteTripAction, updateTripAction } from "@/features/trip/api/tripActions";
import { cn } from "@/lib/utils";

const labelCls = "block text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase mb-2.5 ml-1";
const inputCls =
  "w-full rounded-2xl bg-secondary/30 border border-border/50 px-4 py-4 text-[14px] font-medium text-foreground placeholder:text-muted-foreground/30 transition-all focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none";

const COLOR_PRESETS = [
  { name: "Amber Gold", value: "#F5C842" },
  { name: "Rose Pink", value: "#E11D48" },
  { name: "Sky Blue", value: "#0EA5E9" },
  { name: "Emerald", value: "#10B981" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Slate", value: "#475569" },
];

interface Props {
  initialData?: {
    id: string;
    title: string;
    description: string | null;
    location: string;
    startDate: string;
    endDate: string;
    accentColor: string;
  };
}

export default function NewTripForm({ initialData }: Props) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(initialData?.accentColor || COLOR_PRESETS[0].value);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      const result = initialData ? await updateTripAction(initialData.id, formData) : await createTrip(formData);

      if (result.success) {
        router.push(`/trip/${result.slug}`);
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("予期せぬエラーが発生しました");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!initialData || !confirm("この旅の全データを削除してもよろしいですか？この操作は取り消せません。")) return;

    setIsDeleting(true);
    try {
      const result = await deleteTripAction(initialData.id);
      if (result.success) {
        router.push("/");
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Title Field */}
      <div>
        <label className={labelCls}>Journey Title</label>
        <div className="relative">
          <Sparkles size={16} className="text-primary/40 absolute top-1/2 left-4 -translate-y-1/2" />
          <input
            name="title"
            required
            defaultValue={initialData?.title}
            placeholder="例: ふたりの福岡記念日旅行"
            className={cn(inputCls, "pl-11")}
          />
        </div>
      </div>

      {/* Description Field */}
      <div>
        <label className={labelCls}>Short Description</label>
        <div className="relative">
          <FileText size={16} className="text-muted-foreground/40 absolute top-4 left-4" />
          <textarea
            name="description"
            defaultValue={initialData?.description || ""}
            placeholder="この旅のテーマや目的を一言で..."
            className={cn(inputCls, "h-24 resize-none pt-4 pl-11")}
          />
        </div>
      </div>

      {/* Location Field */}
      <div>
        <label className={labelCls}>Destination</label>
        <div className="relative">
          <MapPin size={16} className="text-muted-foreground/40 absolute top-1/2 left-4 -translate-y-1/2" />
          <input
            name="location"
            required
            defaultValue={initialData?.location}
            placeholder="例: 福岡市, 博多"
            className={cn(inputCls, "pl-11")}
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Departure</label>
          <div className="relative">
            <Calendar
              size={16}
              className="text-muted-foreground/40 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
            />
            <input
              name="startDate"
              type="date"
              required
              defaultValue={initialData?.startDate.split("T")[0]}
              className={cn(inputCls, "block appearance-none pl-11")}
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Return</label>
          <div className="relative">
            <Calendar
              size={16}
              className="text-muted-foreground/40 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
            />
            <input
              name="endDate"
              type="date"
              required
              defaultValue={initialData?.endDate.split("T")[0]}
              className={cn(inputCls, "block appearance-none pl-11")}
            />
          </div>
        </div>
      </div>

      {/* Accent Color Selection */}
      <div className="pt-2">
        <label className={labelCls}>Theme Accent</label>
        <div className="mb-4 grid grid-cols-4 gap-3 sm:grid-cols-7">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setSelectedColor(color.value)}
              className={cn(
                "group relative h-10 w-full rounded-xl transition-all active:scale-95",
                selectedColor === color.value
                  ? "ring-primary ring-offset-background ring-2 ring-offset-2"
                  : "hover:ring-border hover:ring-2 hover:ring-offset-1",
              )}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {selectedColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white shadow-sm" />
                </div>
              )}
            </button>
          ))}
          <div className="border-border/50 bg-secondary/30 relative flex h-10 w-full items-center justify-center overflow-hidden rounded-xl border">
            <Palette size={14} className="text-muted-foreground/40" />
            <input
              name="accentColor"
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 pt-4 sm:flex-row">
        {initialData && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending || isDeleting}
            className="flex items-center justify-center gap-2 rounded-3xl border border-rose-200 px-6 py-5 font-bold text-rose-500 transition-all hover:bg-rose-50 disabled:opacity-40"
          >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            <span className="text-xs tracking-widest uppercase">Delete</span>
          </button>
        )}
        <button
          type="submit"
          disabled={isPending || isDeleting}
          className={cn(
            "bg-foreground text-background shadow-foreground/10 flex flex-1 items-center justify-center gap-3 rounded-3xl py-5 text-[13px] font-black tracking-[0.2em] uppercase shadow-2xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40",
            (isPending || isDeleting) && "cursor-not-allowed",
          )}
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : initialData ? (
            <Save size={18} />
          ) : (
            <Sparkles size={18} className="text-amber-400" />
          )}
          {isPending ? "Saving..." : initialData ? "Update Journey" : "Start Your Adventure"}
        </button>
      </div>
    </form>
  );
}
