import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eq, desc, and, gte, lte, like, or } from "drizzle-orm";
import * as Crypto from "expo-crypto";
import { db } from "../db/client";
import { sessions } from "../db/schema";
import { Session, SessionFormData, SessionType } from "../types";

export interface SessionFilters {
  type?: SessionType;
  startDate?: Date;
  endDate?: Date;
  searchText?: string;
}

export function useSessions(filters?: SessionFilters) {
  const queryClient = useQueryClient();

  const { data: sessionList = [], isLoading } = useQuery({
    queryKey: ["sessions", filters],
    queryFn: async () => {
      try {
        let query = db.select().from(sessions);

        // Build conditions array
        const conditions = [];

        if (filters?.type) {
          conditions.push(eq(sessions.type, filters.type));
        }

        if (filters?.startDate) {
          conditions.push(gte(sessions.date, filters.startDate));
        }

        if (filters?.endDate) {
          conditions.push(lte(sessions.date, filters.endDate));
        }

        if (filters?.searchText) {
          const searchPattern = `%${filters.searchText}%`;
          conditions.push(
            or(
              like(sessions.focus, searchPattern),
              like(sessions.notes, searchPattern),
              like(sessions.gym, searchPattern)
            )
          );
        }

        const result = conditions.length > 0
          ? await query.where(and(...conditions)).orderBy(desc(sessions.date))
          : await query.orderBy(desc(sessions.date));

        return result.map((s) => ({
          ...s,
          date: s.date instanceof Date ? s.date : new Date(s.date),
          createdAt: s.createdAt instanceof Date ? s.createdAt : new Date(s.createdAt),
          updatedAt: s.updatedAt instanceof Date ? s.updatedAt : new Date(s.updatedAt),
        })) as Session[];
      } catch (error) {
        console.error("Error fetching sessions:", error);
        return [];
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SessionFormData) => {
      const now = new Date();
      const id = Crypto.randomUUID();

      console.log("Creating session with data:", { id, ...data });

      const newSession = {
        id,
        date: data.date,
        duration: data.duration,
        type: data.type,
        focus: data.focus || null,
        intensity: data.intensity || null,
        sparringRounds: data.sparringRounds || null,
        notes: data.notes || null,
        gym: data.gym || null,
        instructor: data.instructor || null,
        createdAt: now,
        updatedAt: now,
      };

      await db.insert(sessions).values(newSession);
      console.log("Session created successfully");
      return newSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session-stats"] });
    },
    onError: (error) => {
      console.error("Error creating session:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SessionFormData> }) => {
      const updateData: Record<string, unknown> = { updatedAt: new Date() };

      if (data.date !== undefined) updateData.date = data.date;
      if (data.duration !== undefined) updateData.duration = data.duration;
      if (data.type !== undefined) updateData.type = data.type;
      if (data.focus !== undefined) updateData.focus = data.focus || null;
      if (data.intensity !== undefined) updateData.intensity = data.intensity || null;
      if (data.sparringRounds !== undefined) updateData.sparringRounds = data.sparringRounds || null;
      if (data.notes !== undefined) updateData.notes = data.notes || null;
      if (data.gym !== undefined) updateData.gym = data.gym || null;
      if (data.instructor !== undefined) updateData.instructor = data.instructor || null;

      await db.update(sessions)
        .set(updateData)
        .where(eq(sessions.id, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session-stats"] });
    },
    onError: (error) => {
      console.error("Error updating session:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await db.delete(sessions).where(eq(sessions.id, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session-stats"] });
    },
    onError: (error) => {
      console.error("Error deleting session:", error);
    },
  });

  const getSession = (id: string) => sessionList.find((s) => s.id === id);

  return {
    sessions: sessionList,
    isLoading,
    createSession: createMutation.mutateAsync,
    updateSession: (id: string, data: Partial<SessionFormData>) =>
      updateMutation.mutateAsync({ id, data }),
    deleteSession: deleteMutation.mutateAsync,
    getSession,
  };
}
