import { z } from 'zod';

export const createHabitSchema = z.object({
  name: z.string().min(1, "Habit name cannot be empty"),
  description: z.string().optional(),
  points: z.number().int().positive("Points must be a positive integer"),
  category: z.string().min(1, "Category cannot be empty"),
  userId: z.string().uuid("Invalid user ID format"),
});

export type CreateHabitSchema = z.infer<typeof createHabitSchema>;

export const updateHabitSchema = z.object({
  name: z.string().min(1, "Habit name cannot be empty").optional(),
  description: z.string().optional(),
  points: z.number().int().positive("Points must be a positive integer").optional(),
  category: z.string().min(1, "Category cannot be empty").optional(),
}).partial(); 

export type UpdateHabitSchema = z.infer<typeof updateHabitSchema>;

export const habitIdParamSchema = z.object({
  id: z.string().uuid("Invalid habit ID format"),
});

export type HabitIdParamSchema = z.infer<typeof habitIdParamSchema>;

export const userIdParamSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
});

export type UserIdParamSchema = z.infer<typeof userIdParamSchema>;
