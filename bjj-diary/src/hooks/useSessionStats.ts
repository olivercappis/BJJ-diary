import { useQuery } from "@tanstack/react-query";
import { db } from "../db/client";
import { sessions } from "../db/schema";
import { desc, gte, and } from "drizzle-orm";
import { startOfWeek, startOfMonth, startOfDay, subDays, differenceInCalendarDays } from "date-fns";

export interface SessionStats {
  totalSessions: number;
  totalHours: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
  hoursThisMonth: number;
  currentStreak: number;
  averageIntensity: number;
  averageDuration: number;
}

export function useSessionStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["session-stats"],
    queryFn: async (): Promise<SessionStats> => {
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
      const monthStart = startOfMonth(now);

      // Get all sessions
      const allSessions = await db.select().from(sessions).orderBy(desc(sessions.date));

      if (allSessions.length === 0) {
        return {
          totalSessions: 0,
          totalHours: 0,
          sessionsThisWeek: 0,
          sessionsThisMonth: 0,
          hoursThisMonth: 0,
          currentStreak: 0,
          averageIntensity: 0,
          averageDuration: 0,
        };
      }

      // Calculate totals
      const totalSessions = allSessions.length;
      const totalMinutes = allSessions.reduce((sum, s) => sum + s.duration, 0);
      const totalHours = Math.round(totalMinutes / 60 * 10) / 10; // Round to 1 decimal

      // Sessions this week
      const sessionsThisWeek = allSessions.filter(
        (s) => new Date(s.date) >= weekStart
      ).length;

      // Sessions this month
      const monthSessions = allSessions.filter(
        (s) => new Date(s.date) >= monthStart
      );
      const sessionsThisMonth = monthSessions.length;
      const hoursThisMonth = Math.round(
        monthSessions.reduce((sum, s) => sum + s.duration, 0) / 60 * 10
      ) / 10;

      // Calculate streak (consecutive days with training)
      const currentStreak = calculateStreak(allSessions.map((s) => new Date(s.date)));

      // Average intensity (only count sessions with intensity set)
      const sessionsWithIntensity = allSessions.filter((s) => s.intensity != null);
      const averageIntensity = sessionsWithIntensity.length > 0
        ? Math.round(
            sessionsWithIntensity.reduce((sum, s) => sum + (s.intensity || 0), 0) /
            sessionsWithIntensity.length * 10
          ) / 10
        : 0;

      // Average duration
      const averageDuration = Math.round(totalMinutes / totalSessions);

      return {
        totalSessions,
        totalHours,
        sessionsThisWeek,
        sessionsThisMonth,
        hoursThisMonth,
        currentStreak,
        averageIntensity,
        averageDuration,
      };
    },
  });

  return { stats, isLoading };
}

function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  // Sort dates descending (most recent first)
  const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());

  // Get unique days (remove duplicates from same day)
  const uniqueDays = new Map<string, Date>();
  sortedDates.forEach((date) => {
    const dayKey = startOfDay(date).toISOString();
    if (!uniqueDays.has(dayKey)) {
      uniqueDays.set(dayKey, startOfDay(date));
    }
  });

  const sortedUniqueDays = Array.from(uniqueDays.values()).sort(
    (a, b) => b.getTime() - a.getTime()
  );

  if (sortedUniqueDays.length === 0) return 0;

  const today = startOfDay(new Date());
  const mostRecentSession = sortedUniqueDays[0];

  // If most recent session is not today or yesterday, streak is 0
  const daysSinceLastSession = differenceInCalendarDays(today, mostRecentSession);
  if (daysSinceLastSession > 1) return 0;

  // Count consecutive days
  let streak = 1;
  for (let i = 1; i < sortedUniqueDays.length; i++) {
    const daysDiff = differenceInCalendarDays(
      sortedUniqueDays[i - 1],
      sortedUniqueDays[i]
    );
    if (daysDiff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
