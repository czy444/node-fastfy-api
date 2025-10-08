import { FastifyReply, FastifyRequest } from 'fastify';
import { ReportService } from 'core/application/report/report.service';
import { Report } from 'core/domain/report/report.entity';

export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  async createReport(request: FastifyRequest, reply: FastifyReply) {
    const { userId, startDate, endDate, totalPoints, co2Saved, waterSaved } = request.body as Omit<Report, 'id' | 'createdAt' | 'updatedAt'>;

    try {
      const newReport = await this.reportService.createReport({ userId, startDate, endDate, totalPoints, co2Saved, waterSaved });
      return reply.code(201).send(newReport);
    } catch (error: any) {
      reply.code(500).send({ message: 'Error creating report', error: error.message });
    }
  }

  async getReportById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    try {
      const report = await this.reportService.getReportById(id);
      if (!report) {
        return reply.code(404).send({ message: 'Report not found' });
      }
      return reply.code(200).send(report);
    } catch (error: any) {
      reply.code(500).send({ message: 'Error fetching report', error: error.message });
    }
  }

  async getReportsByUserId(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };

    try {
      const reports = await this.reportService.getReportsByUserId(userId);
      return reply.code(200).send(reports);
    } catch (error: any) {
      reply.code(500).send({ message: 'Error fetching user reports', error: error.message });
    }
  }

  async updateReport(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const updates = request.body as Partial<Report>;

    try {
      const updatedReport = await this.reportService.updateReport(id, updates);
      if (!updatedReport) {
        return reply.code(404).send({ message: 'Report not found' });
      }
      return reply.code(200).send(updatedReport);
    } catch (error: any) {
      reply.code(500).send({ message: 'Error updating report', error: error.message });
    }
  }

  async deleteReport(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    try {
      await this.reportService.deleteReport(id);
      return reply.code(204).send();
    } catch (error: any) {
      reply.code(500).send({ message: 'Error deleting report', error: error.message });
    }
  }
}
