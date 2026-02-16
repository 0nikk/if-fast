import { FastingSession } from '../context/FastingContext';

export type FastingSummary = {
  completedCount: number;
  completionRate: number;
  averageCompletedSeconds: number;
  longestCompletedSeconds: number;
  totalCompletedSeconds: number;
};

export const getSummary = (sessions: FastingSession[]): FastingSummary => {
  const completedSessions = sessions.filter((session) => session.status === 'completed');
  const completedCount = completedSessions.length;
  const totalCount = sessions.length;

  const totalCompletedSeconds = completedSessions.reduce(
    (total, session) => total + session.actualSeconds,
    0,
  );

  const longestCompletedSeconds = completedSessions.reduce(
    (longest, session) => Math.max(longest, session.actualSeconds),
    0,
  );

  return {
    completedCount,
    completionRate: totalCount > 0 ? completedCount / totalCount : 0,
    averageCompletedSeconds:
      completedCount > 0 ? Math.round(totalCompletedSeconds / completedCount) : 0,
    longestCompletedSeconds,
    totalCompletedSeconds,
  };
};
