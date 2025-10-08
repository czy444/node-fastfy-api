import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from 'infrastructure/persistence/prisma/prisma-user.repository';
import { UserService } from 'core/application/user/user.service';
import { PrismaHabitRepository } from 'infrastructure/persistence/prisma/prisma-habit.repository';
import { HabitService } from 'core/application/habit/habit.service';
import { PrismaHabitLogRepository } from 'infrastructure/persistence/prisma/prisma-habit-log.repository';
import { HabitLogService } from 'core/application/habit/habit-log.service';
import { PrismaReportRepository } from 'infrastructure/persistence/prisma/prisma-report.repository';
import { ReportService } from 'core/application/report/report.service';
import { Scheduler } from 'utils/scheduler';
import { userRoutes } from 'application/routes/user.routes';
import { habitRoutes } from 'application/routes/habit.routes';
import { habitLogRoutes } from 'application/routes/habit-log.routes';
import { reportRoutes } from 'application/routes/report.routes';

export class Container {
  public readonly prisma: PrismaClient;
  public readonly userRepository: PrismaUserRepository;
  public readonly userService: UserService;
  public readonly habitRepository: PrismaHabitRepository;
  public readonly habitService: HabitService;
  public readonly habitLogRepository: PrismaHabitLogRepository;
  public readonly habitLogService: HabitLogService;
  public readonly reportRepository: PrismaReportRepository;
  public readonly reportService: ReportService;
  public readonly scheduler: Scheduler;
  public readonly userRoutes: typeof userRoutes;
  public readonly habitRoutes: typeof habitRoutes;
  public readonly habitLogRoutes: typeof habitLogRoutes;
  public readonly reportRoutes: typeof reportRoutes;

  constructor() {
    this.prisma = new PrismaClient();

    // Repositories
    this.userRepository = new PrismaUserRepository(this.prisma);
    this.habitRepository = new PrismaHabitRepository(this.prisma);
    this.habitLogRepository = new PrismaHabitLogRepository(this.prisma);
    this.reportRepository = new PrismaReportRepository(this.prisma);

    // Services
    this.userService = new UserService(this.userRepository);
    this.habitService = new HabitService(this.habitRepository);
    this.habitLogService = new HabitLogService(this.habitLogRepository);
    this.reportService = new ReportService(this.reportRepository);

    // Scheduler
    this.scheduler = new Scheduler(
      this.reportService,
      this.userService,
      this.habitRepository,
      this.habitLogRepository,
    );

    // Routes
    this.userRoutes = userRoutes;
    this.habitRoutes = habitRoutes;
    this.habitLogRoutes = habitLogRoutes;
    this.reportRoutes = reportRoutes;
  }
}

export const container = new Container();
