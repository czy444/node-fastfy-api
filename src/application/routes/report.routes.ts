import { FastifyInstance } from 'fastify';
import { ReportController } from '../controllers/report.controller';
import { createReportSchema, updateReportSchema, reportIdParamSchema, userIdParamForReportSchema } from '../schemas/report.schemas';
import { container } from 'src/container';

export async function reportRoutes(fastify: FastifyInstance) {
  const reportController = new ReportController(container.reportService);

  fastify.post('/reports', {
    schema: {
      body: createReportSchema,
    },
    handler: reportController.createReport.bind(reportController),
  });

  fastify.get('/reports/:id', {
    schema: {
      params: reportIdParamSchema,
    },
    handler: reportController.getReportById.bind(reportController),
  });

  fastify.get('/users/:userId/reports', {
    schema: {
      params: userIdParamForReportSchema,
    },
    handler: reportController.getReportsByUserId.bind(reportController),
  });

  fastify.put('/reports/:id', {
    schema: {
      params: reportIdParamSchema,
      body: updateReportSchema,
    },
    handler: reportController.updateReport.bind(reportController),
  });

  fastify.delete('/reports/:id', {
    schema: {
      params: reportIdParamSchema,
    },
    handler: reportController.deleteReport.bind(reportController),
  });
}
