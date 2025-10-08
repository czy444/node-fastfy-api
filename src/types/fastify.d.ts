import { UserService } from "core/application/user/user.service";
import { HabitService } from "core/application/habit/habit.service";
import { HabitLogService } from "core/application/habit/habit-log.service";
import { ReportService } from "core/application/report/report.service";

declare module 'fastify' {
  interface FastifyInstance {
    userService: UserService;
    habitService: HabitService;
    habitLogService: HabitLogService;
    reportService: ReportService;
  }

  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
    };
  }
}
