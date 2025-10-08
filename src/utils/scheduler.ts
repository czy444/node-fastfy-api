import cron from 'node-cron';
import { ReportService } from 'core/application/report/report.service';
import { UserService } from 'core/application/user/user.service';
import { HabitLogRepository } from 'core/application/habit/habit-log.repository';
import { HabitRepository } from 'core/application/habit/habit.repository';

export class Scheduler {
  constructor(
    private readonly reportService: ReportService,
    private readonly userService: UserService,
    private readonly habitRepository: HabitRepository,
    private readonly habitLogRepository: HabitLogRepository,
  ) {}

  start() {
    cron.schedule('0 0 * * 0', async () => {
      console.log('Running weekly report generation task...');
      await this.generateWeeklyReports();
    });
  }

  private async generateWeeklyReports() {
    const users = await this.userService.getAllUsers();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7); 

    for (const user of users) {
      const userHabits = await this.habitRepository.findByUserId(user.id);
      let totalPoints = 0;
      let co2Saved = 0;
      let waterSaved = 0;

      for (const habit of userHabits) {
        const habitLogs = await this.habitLogRepository.findByHabitId(habit.id);
        const weeklyLogs = habitLogs.filter(log => log.date >= startDate && log.date <= endDate);

        for (const log of weeklyLogs) {
          totalPoints += log.pointsEarned;
          co2Saved += log.pointsEarned * 0.1; 
          waterSaved += log.pointsEarned * 5; 
        }
      }

      await this.reportService.createReport({
        userId: user.id,
        startDate,
        endDate,
        totalPoints,
        co2Saved,
        waterSaved,
      });
      console.log(`Generated weekly report for user ${user.id}`);
    }
  }
}
