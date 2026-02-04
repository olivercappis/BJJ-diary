import { View, Text, FlatList, Pressable } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Trophy } from "lucide-react-native";
import { useTournaments } from "../../../src/hooks/useTournaments";
import { TournamentCard } from "../../../src/components/tournaments/TournamentCard";

export default function TournamentsScreen() {
  const { tournaments, isLoading } = useTournaments();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading tournaments...</Text>
        </View>
      ) : tournaments.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Trophy color="#9ca3af" size={64} />
          <Text className="text-xl font-semibold text-gray-900 mt-4">No tournaments yet</Text>
          <Text className="text-gray-500 text-center mt-2">
            Track your competition results and build your tournament history.
          </Text>
          <Link href="/tournaments/new" asChild>
            <Pressable className="mt-6 bg-primary-600 rounded-xl px-6 py-3 flex-row items-center">
              <Plus color="#ffffff" size={20} />
              <Text className="text-white font-semibold ml-2">Add Tournament</Text>
            </Pressable>
          </Link>
        </View>
      ) : (
        <FlatList
          data={tournaments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TournamentCard tournament={item} />}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
        />
      )}

      {tournaments.length > 0 && (
        <Link href="/tournaments/new" asChild>
          <Pressable className="absolute bottom-6 right-6 bg-primary-600 rounded-full w-14 h-14 items-center justify-center shadow-lg">
            <Plus color="#ffffff" size={28} />
          </Pressable>
        </Link>
      )}
    </SafeAreaView>
  );
}
