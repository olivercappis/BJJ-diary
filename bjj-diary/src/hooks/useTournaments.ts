import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import * as Crypto from "expo-crypto";
import { db } from "../db/client";
import { tournaments } from "../db/schema";
import { Tournament, TournamentFormData } from "../types";

export function useTournaments() {
  const queryClient = useQueryClient();

  const { data: tournamentList = [], isLoading } = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const result = await db.select().from(tournaments).orderBy(tournaments.date);
      return result.reverse().map((t) => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      })) as Tournament[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TournamentFormData) => {
      const now = new Date();
      const newTournament = {
        id: Crypto.randomUUID(),
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      await db.insert(tournaments).values(newTournament);
      return newTournament;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await db.delete(tournaments).where(eq(tournaments.id, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });

  const getTournament = (id: string) => tournamentList.find((t) => t.id === id);

  return {
    tournaments: tournamentList,
    isLoading,
    createTournament: createMutation.mutateAsync,
    deleteTournament: deleteMutation.mutateAsync,
    getTournament,
  };
}
