import { PrismaClient } from "@prisma/client";
import { Report } from "core/domain/report/report.entity";
import { ReportRepository } from "core/application/report/report.repository";

export class PrismaReportRepository implements ReportRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Report | null> {
    return this.prisma.report.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Report[]> {
    return this.prisma.report.findMany({ where: { userId } });
  }

  async create(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Report> {
    return this.prisma.report.create({ data: report });
  }

  async update(id: string, report: Partial<Report>): Promise<Report> {
    return this.prisma.report.update({ where: { id }, data: report });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.report.delete({ where: { id } });
  }
}
