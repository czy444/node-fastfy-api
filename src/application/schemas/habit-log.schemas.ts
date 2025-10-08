import { z } from 'zod';

export const createHabitLogSchema = z.object({
  habitId: z.string().uuid("Invalid habit ID format"),
  pointsEarned: z.number().int().positive("Points earned must be a positive integer"),
});

export type CreateHabitLogSchema = z.infer<typeof createHabitLogSchema>;

export const updateHabitLogSchema = z.object({
  habitId: z.string().uuid("Invalid habit ID format").optional(),
  pointsEarned: z.number().int().positive("Points earned must be a positive integer").optional(),
}).partial();

export type UpdateHabitLogSchema = z.infer<typeof updateHabitLogSchema>;

export const habitLogIdParamSchema = z.object({
  id: z.string().uuid("Invalid habit log ID format"),
});

export type HabitLogIdParamSchema = z.infer<typeof habitLogIdParamSchema>;

export const habitIdParamForLogSchema = z.object({
  habitId: z.string().uuid("Invalid habit ID format"),
});

export type HabitIdParamForLogSchema = z.infer<typeof habitIdParamForLogSchema>;
