import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { format } from "date-fns";
import { MapPin } from "lucide-react-native";
import { Tournament } from "../../types";

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const getPlacementBadge = (place?: number) => {
    if (!place) return null;
    const colors: Record<number, { bg: string; text: string }> = {
      1: { bg: "bg-yellow-400", text: "text-yellow-900" },
      2: { bg: "bg-gray-300", text: "text-gray-900" },
      3: { bg: "bg-amber-600", text: "text-white" },
    };
    return colors[place] || { bg: "bg-gray-200", text: "text-gray-700" };
  };

  const badge = getPlacementBadge(tournament.placement);

  return (
    <Link href={`/tournaments/${tournament.id}`} asChild>
      <Pressable className="bg-white rounded-xl p-4 shadow-sm">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">{tournament.name}</Text>
            <Text className="text-gray-500 text-sm">
              {format(new Date(tournament.date), "MMM d, yyyy")}
            </Text>
          </View>
          {badge && (
            <View className={`${badge.bg} w-10 h-10 rounded-full items-center justify-center`}>
              <Text className={`${badge.text} font-bold`}>{tournament.placement}</Text>
            </View>
          )}
        </View>
        <View className="flex-row flex-wrap gap-2 mb-2">
          <View className="bg-primary-100 px-2 py-1 rounded">
            <Text className="text-primary-700 text-xs font-medium">
              {tournament.type === "gi" ? "Gi" : "No-Gi"}
            </Text>
          </View>
          <View className="bg-gray-100 px-2 py-1 rounded">
            <Text className="text-gray-700 text-xs font-medium">{tournament.beltRank} Belt</Text>
          </View>
          <View className="bg-gray-100 px-2 py-1 rounded">
            <Text className="text-gray-700 text-xs font-medium">{tournament.weightClass}</Text>
          </View>
        </View>
        {tournament.location && (
          <View className="flex-row items-center">
            <MapPin color="#6b7280" size={14} />
            <Text className="text-gray-500 text-sm ml-1">{tournament.location}</Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
}
