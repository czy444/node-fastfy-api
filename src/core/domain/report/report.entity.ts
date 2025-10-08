export interface Report {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPoints: number;
  co2Saved: number;
  waterSaved: number;
  createdAt: Date;
  updatedAt: Date;
}
