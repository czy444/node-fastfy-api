import { Report } from "core/domain/report/report.entity";
import { ReportRepository } from "./report.repository";

export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async getReportById(id: string): Promise<Report | null> {
    return this.reportRepository.findById(id);
  }

  async getReportsByUserId(userId: string): Promise<Report[]> {
    return this.reportRepository.findByUserId(userId);
  }

  async createReport(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Report> {
    return this.reportRepository.create(report);
  }

  async updateReport(id: string, report: Partial<Report>): Promise<Report> {
    return this.reportRepository.update(id, report);
  }

  async deleteReport(id: string): Promise<void> {
    return this.reportRepository.delete(id);
  }
}
