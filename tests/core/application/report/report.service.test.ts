import { ReportService } from '../../../../src/core/application/report/report.service';
import { ReportRepository } from '../../../../src/core/application/report/report.repository';
import { Report } from '../../../../src/core/domain/report/report.entity';

describe('ReportService', () => {
  let reportService: ReportService;
  let mockReportRepository: jest.Mocked<ReportRepository>;

  beforeEach(() => {
    mockReportRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    reportService = new ReportService(mockReportRepository);
  });

  it('should get a report by ID', async () => {
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
    mockReportRepository.findById.mockResolvedValue(report);

    const result = await reportService.getReportById('1');
    expect(result).toEqual(report);
    expect(mockReportRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should get reports by user ID', async () => {
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
    mockReportRepository.findByUserId.mockResolvedValue(reports);

    const result = await reportService.getReportsByUserId('user1');
    expect(result).toEqual(reports);
    expect(mockReportRepository.findByUserId).toHaveBeenCalledWith('user1');
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

    mockReportRepository.create.mockResolvedValue(createdReport);

    const result = await reportService.createReport(newReportInput);
    expect(result).toEqual(createdReport);
    expect(mockReportRepository.create).toHaveBeenCalledWith(newReportInput);
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

    mockReportRepository.update.mockResolvedValue(updatedReport);

    const result = await reportService.updateReport('1', updates);
    expect(result).toEqual(updatedReport);
    expect(mockReportRepository.update).toHaveBeenCalledWith('1', updates);
  });

  it('should delete a report', async () => {
    mockReportRepository.delete.mockResolvedValue(undefined);

    await reportService.deleteReport('1');
    expect(mockReportRepository.delete).toHaveBeenCalledWith('1');
  });
});
