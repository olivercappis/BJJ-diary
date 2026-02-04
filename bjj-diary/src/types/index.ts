// Session Types
export type SessionType = "gi" | "no-gi" | "open-mat" | "private" | "competition-training" | "seminar";

export interface Session {
  id: string;
  date: Date;
  duration: number;
  type: SessionType;
  focus?: string;
  intensity?: number;
  sparringRounds?: number;
  notes?: string;
  gym?: string;
  instructor?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionFormData {
  date: Date;
  duration: number;
  type: SessionType;
  focus?: string;
  intensity?: number;
  sparringRounds?: number;
  notes?: string;
  gym?: string;
  instructor?: string;
}

// Technique Types
export type TechniqueCategory = "submission" | "sweep" | "pass" | "escape" | "takedown" | "guard" | "control" | "transition";

export type Position =
  | "closed-guard" | "open-guard" | "half-guard" | "butterfly-guard"
  | "de-la-riva" | "spider-guard" | "lasso-guard" | "x-guard" | "deep-half"
  | "mount" | "side-control" | "back-control" | "turtle" | "standing"
  | "north-south" | "knee-on-belly" | "crucifix" | "other";

export interface Technique {
  id: string;
  name: string;
  category: TechniqueCategory;
  position: Position;
  giOnly: boolean;
  description?: string;
  notes?: string;
  proficiencyLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TechniqueFormData {
  name: string;
  category: TechniqueCategory;
  position: Position;
  giOnly?: boolean;
  description?: string;
  notes?: string;
  proficiencyLevel?: number;
}

// Tournament Types
export type BeltRank = "white" | "blue" | "purple" | "brown" | "black";
export type MatchResult = "win" | "loss" | "draw";
export type MatchMethod = "submission" | "points" | "advantages" | "penalties" | "dq" | "injury";

export interface Tournament {
  id: string;
  name: string;
  organization?: string;
  date: Date;
  location?: string;
  type: "gi" | "no-gi";
  weightClass: string;
  division: string;
  beltRank: BeltRank;
  ageClass: string;
  placement?: number;
  totalCompetitors?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TournamentFormData {
  name: string;
  organization?: string;
  date: Date;
  location?: string;
  type: "gi" | "no-gi";
  weightClass: string;
  division: string;
  beltRank: BeltRank;
  ageClass: string;
  placement?: number;
  totalCompetitors?: number;
  notes?: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  opponentName?: string;
  result: MatchResult;
  method?: MatchMethod;
  myScore?: number;
  opponentScore?: number;
  notes?: string;
  createdAt: Date;
}
