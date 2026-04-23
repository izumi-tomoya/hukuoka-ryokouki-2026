import { z } from "zod";

export const eventSchema = z.object({
  time: z.string().optional(),
  type: z.enum(["food", "transport", "sightseeing", "hotel", "shopping", "surprise", "basic"]).optional(),
  title: z.string().optional().transform((val) => val?.trim()),
  desc: z.string().optional().transform((val) => val?.trim()),
  tag: z.enum(["food", "transport", "sightseeing", "hotel", "shopping", "surprise", "night"]).optional(),
  tagLabel: z.string().optional().transform((val) => val?.trim()),
  access: z.array(z.string()).optional(),
  foodName: z.string().optional().transform((val) => val?.trim()),
  foodDesc: z.string().optional().transform((val) => val?.trim()),
  highlight: z.string().optional().transform((val) => val?.trim()),
  isYatai: z.boolean().optional(),
  yataiStops: z.array(z.object({
    time: z.string().min(1),
    stop: z.string().min(1),
    desc: z.string().optional()
  })).optional(),
  id: z.string().optional(),
  isConfirmed: z.boolean().optional(),
  locationUrl: z.string().url().optional().or(z.literal("")),
  budget: z.number().optional()
});

export type EventFormData = z.infer<typeof eventSchema>;
