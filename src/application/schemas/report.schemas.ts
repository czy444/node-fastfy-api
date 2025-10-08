import { z } from 'zod';

export const createReportSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  startDate: z.string().datetime("Invalid start date format").transform((str) => new Date(str)),
  endDate: z.string().datetime("Invalid end date format").transform((str) => new Date(str)),
  totalPoints: z.number().int().min(0, "Total points cannot be negative"),
  co2Saved: z.number().min(0, "CO2 saved cannot be negative"),
  waterSaved: z.number().min(0, "Water saved cannot be negative"),
});

export type CreateReportSchema = z.infer<typeof createReportSchema>;

export const updateReportSchema = z.object({
  userId: z.string().uuid("Invalid user ID format").optional(),
  startDate: z.string().datetime("Invalid start date format").transform((str) => new Date(str)).optional(),
  endDate: z.string().datetime("Invalid end date format").transform((str) => new Date(str)).optional(),
  totalPoints: z.number().int().min(0, "Total points cannot be negative").optional(),
  co2Saved: z.number().min(0, "CO2 saved cannot be negative").optional(),
  waterSaved: z.number().min(0, "Water saved cannot be negative").optional(),
}).partial();

export type UpdateReportSchema = z.infer<typeof updateReportSchema>;

export const reportIdParamSchema = z.object({
  id: z.string().uuid("Invalid report ID format"),
});

export type ReportIdParamSchema = z.infer<typeof reportIdParamSchema>;

export const userIdParamForReportSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
});

export type UserIdParamForReportSchema = z.infer<typeof userIdParamForReportSchema>;
