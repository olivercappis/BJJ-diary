import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import * as Crypto from "expo-crypto";
import { db } from "../db/client";
import { techniques } from "../db/schema";
import { Technique, TechniqueFormData } from "../types";

export function useTechniques() {
  const queryClient = useQueryClient();

  const { data: techniqueList = [], isLoading } = useQuery({
    queryKey: ["techniques"],
    queryFn: async () => {
      const result = await db.select().from(techniques).orderBy(techniques.name);
      return result.map((t) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
        giOnly: Boolean(t.giOnly),
      })) as Technique[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TechniqueFormData) => {
      const now = new Date();
      const newTechnique = {
        id: Crypto.randomUUID(),
        ...data,
        giOnly: data.giOnly ?? false,
        proficiencyLevel: data.proficiencyLevel ?? 1,
        createdAt: now,
        updatedAt: now,
      };
      await db.insert(techniques).values(newTechnique);
      return newTechnique;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techniques"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<TechniqueFormData>) => {
      await db.update(techniques).set({ ...data, updatedAt: new Date() }).where(eq(techniques.id, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techniques"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await db.delete(techniques).where(eq(techniques.id, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techniques"] });
    },
  });

  const getTechnique = (id: string) => techniqueList.find((t) => t.id === id);

  return {
    techniques: techniqueList,
    isLoading,
    createTechnique: createMutation.mutateAsync,
    updateTechnique: (id: string, data: Partial<TechniqueFormData>) => updateMutation.mutateAsync({ id, ...data }),
    deleteTechnique: deleteMutation.mutateAsync,
    getTechnique,
  };
}
