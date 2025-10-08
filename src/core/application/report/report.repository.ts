import { Report } from "core/domain/report/report.entity";

export interface ReportRepository {
  findById(id: string): Promise<Report | null>;
  findByUserId(userId: string): Promise<Report[]>;
  create(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Report>;
  update(id: string, report: Partial<Report>): Promise<Report>;
  delete(id: string): Promise<void>;
}
