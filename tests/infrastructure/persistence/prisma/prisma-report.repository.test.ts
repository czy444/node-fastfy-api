import { PrismaClient } from '@prisma/client';
import { PrismaReportRepository } from '../../../../src/infrastructure/persistence/prisma/prisma-report.repository';
import { Report } from '../../../../src/core/domain/report/report.entity';

// Mock PrismaClient
const mockPrisma = {
  report: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as unknown as PrismaClient;

describe('PrismaReportRepository', () => {
  let reportRepository: PrismaReportRepository;

  beforeEach(() => {
    reportRepository = new PrismaReportRepository(mockPrisma);
    jest.clearAllMocks();
  });

  it('should find a report by ID', async () => {
    const report: Report = {
      id: '1',
      userId: 'user1',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-07'),
      totalPoints: 100,
      co2Saved: 10.5,
      waterSaved: 500,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (mockPrisma.report.findUnique as jest.Mock).mockResolvedValue(report);

    const result = await reportRepository.findById('1');
    expect(result).toEqual(report);
    expect(mockPrisma.report.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should find reports by user ID', async () => {
    const reports: Report[] = [
      {
        id: '1',
        userId: 'user1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07'),
        totalPoints: 100,
        co2Saved: 10.5,
        waterSaved: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        userId: 'user1',
        startDate: new Date('2024-01-08'),
        endDate: new Date('2024-01-14'),
        totalPoints: 120,
        co2Saved: 12.0,
        waterSaved: 600,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    (mockPrisma.report.findMany as jest.Mock).mockResolvedValue(reports);

    const result = await reportRepository.findByUserId('user1');
    expect(result).toEqual(reports);
    expect(mockPrisma.report.findMany).toHaveBeenCalledWith({ where: { userId: 'user1' } });
  });

  it('should create a new report', async () => {
    const newReportInput = {
      userId: 'user2',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-07'),
      totalPoints: 80,
      co2Saved: 8.0,
      waterSaved: 400,
    };
    const createdReport: Report = {
      id: '3',
      ...newReportInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (mockPrisma.report.create as jest.Mock).mockResolvedValue(createdReport);

    const result = await reportRepository.create(newReportInput);
    expect(result).toEqual(createdReport);
    expect(mockPrisma.report.create).toHaveBeenCalledWith({ data: newReportInput });
  });

  it('should update a report', async () => {
    const existingReport: Report = {
      id: '1',
      userId: 'user1',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-07'),
      totalPoints: 100,
      co2Saved: 10.5,
      waterSaved: 500,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updates = { totalPoints: 110, co2Saved: 11.0 };
    const updatedReport: Report = { ...existingReport, ...updates };
    (mockPrisma.report.update as jest.Mock).mockResolvedValue(updatedReport);

    const result = await reportRepository.update('1', updates);
    expect(result).toEqual(updatedReport);
    expect(mockPrisma.report.update).toHaveBeenCalledWith({ where: { id: '1' }, data: updates });
  });

  it('should delete a report', async () => {
    (mockPrisma.report.delete as jest.Mock).mockResolvedValue(undefined);

    await reportRepository.delete('1');
    expect(mockPrisma.report.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
