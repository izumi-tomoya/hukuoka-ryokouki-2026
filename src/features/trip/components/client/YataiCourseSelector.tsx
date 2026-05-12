"use client";
import { updateEventAction } from "@/features/trip/api/tripActions";

const YATAI_COURSES = [
  {
    id: "heritage",
    title: "Heritage",
    desc: "中洲で味わう、伝統と職人技の博多文化",
    stops: [
      { time: "20:30", stop: "一竜", desc: "創業以来の変わらぬ豚骨ラーメン。" },
      { time: "21:30", stop: "伸龍", desc: "博多屋台の醍醐味、おでんと焼酎。" },
      { time: "22:30", stop: "きくちゃん", desc: "大将と語らう博多の夜の社交場。" },
    ],
  },
  {
    id: "trendy",
    title: "Trendy",
    desc: "天神で巡る、新鋭フレンチ＆創作ネオ屋台",
    stops: [
      { time: "20:30", stop: "レ・トワ・ショコラ", desc: "屋台で楽しむ絶品フレンチ。" },
      { time: "21:30", stop: "テング屋台", desc: "2026年の注目店、創作バルスタイル。" },
      { time: "22:30", stop: "屋台バー えびちゃん", desc: "屋台とは思えないカクテルの腕前。" },
    ],
  },
  {
    id: "hopping",
    title: "Hopping",
    desc: "一品入魂！屋台のハシゴで巡る黄金ルート",
    stops: [
      { time: "20:30", stop: "焼き鳥・バラ", desc: "まずは福岡流焼き鳥とビールで乾杯。" },
      { time: "21:30", stop: "明太だし巻き", desc: "ハシゴ途中の贅沢な逸品。" },
      { time: "22:30", stop: "焼きラーメン", desc: "〆の逸品をハシゴで完結。" },
    ],
  },
];

export function YataiCourseSelector({ eventId, onSuccess }: { eventId: string; onSuccess: () => void }) {
  const handleApply = async (course: (typeof YATAI_COURSES)[0]) => {
    await updateEventAction(eventId, { yataiStops: course.stops });
    onSuccess();
  };

  return (
    <div className="space-y-4">
      {YATAI_COURSES.map((course) => (
        <div key={course.id} className="border-border/50 rounded-2xl border bg-white p-4">
          <p className="mb-1 text-xs font-bold text-stone-900">{course.title} Course</p>
          <p className="mb-4 text-[10px] text-stone-500 italic">{course.desc}</p>
          <div className="mb-4 space-y-2">
            {course.stops.map((stop, i) => (
              <div key={i} className="flex items-center gap-3 text-[11px]">
                <span className="font-bold text-rose-500">{i + 1}</span>
                <span className="font-bold text-stone-700">{stop.stop}</span>
                <span className="text-stone-400">({stop.time})</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => handleApply(course)}
            className="w-full rounded-xl bg-rose-500 py-2 text-xs font-bold tracking-widest text-white uppercase shadow-lg shadow-rose-200 hover:bg-rose-600"
          >
            このコースに適用する
          </button>
        </div>
      ))}
    </div>
  );
}
