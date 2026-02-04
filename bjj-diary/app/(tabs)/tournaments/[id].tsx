import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";
import { Trash2, MapPin, Calendar, Award } from "lucide-react-native";
import { useTournaments } from "../../../src/hooks/useTournaments";

export default function TournamentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getTournament, deleteTournament } = useTournaments();

  const tournament = getTournament(id);

  const handleDelete = () => {
    Alert.alert("Delete Tournament", "Are you sure you want to delete this tournament?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteTournament(id);
          router.back();
        },
      },
    ]);
  };

  if (!tournament) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500">Tournament not found</Text>
      </SafeAreaView>
    );
  }

  const getPlacementBadge = (place?: number) => {
    if (!place) return null;
    const colors: Record<number, string> = {
      1: "bg-yellow-400",
      2: "bg-gray-300",
      3: "bg-amber-600",
    };
    return colors[place] || "bg-gray-200";
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <ScrollView className="flex-1 px-4 py-4">
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">{tournament.name}</Text>
              {tournament.organization && (
                <Text className="text-gray-500 mt-1">{tournament.organization}</Text>
              )}
            </View>
            {tournament.placement && (
              <View className={`${getPlacementBadge(tournament.placement)} w-12 h-12 rounded-full items-center justify-center`}>
                <Text className="text-lg font-bold">{tournament.placement}</Text>
              </View>
            )}
          </View>
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm flex-row items-center">
            <Calendar color="#4f46e5" size={20} />
            <Text className="text-gray-900 ml-2">{format(new Date(tournament.date), "MMM d, yyyy")}</Text>
          </View>
          {tournament.location && (
            <View className="flex-1 bg-white rounded-xl p-4 shadow-sm flex-row items-center">
              <MapPin color="#10b981" size={20} />
              <Text className="text-gray-900 ml-2 flex-1" numberOfLines={1}>{tournament.location}</Text>
            </View>
          )}
        </View>

        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <Text className="text-gray-700 font-medium mb-3">Division Info</Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="bg-primary-100 px-3 py-1 rounded-full">
              <Text className="text-primary-700 font-medium">{tournament.type === "gi" ? "Gi" : "No-Gi"}</Text>
            </View>
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-gray-700 font-medium">{tournament.beltRank} Belt</Text>
            </View>
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-gray-700 font-medium">{tournament.weightClass}</Text>
            </View>
          </View>
        </View>

        {tournament.notes && (
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-gray-700 font-medium mb-2">Notes</Text>
            <Text className="text-gray-900">{tournament.notes}</Text>
          </View>
        )}

        <Pressable
          onPress={handleDelete}
          className="bg-red-50 border border-red-200 rounded-xl py-3 flex-row items-center justify-center mt-4 mb-8"
        >
          <Trash2 color="#ef4444" size={20} />
          <Text className="text-red-600 font-semibold ml-2">Delete Tournament</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
