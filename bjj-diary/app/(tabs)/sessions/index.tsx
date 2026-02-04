import { View, Text, FlatList, Pressable } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Plus, Calendar } from "lucide-react-native";
import { useSessions, SessionFilters as SessionFiltersType } from "../../../src/hooks/useSessions";
import { SessionCard } from "../../../src/components/sessions/SessionCard";
import { SessionFilters } from "../../../src/components/sessions/SessionFilters";

export default function SessionsScreen() {
  const [filters, setFilters] = useState<SessionFiltersType>({});
  const { sessions, isLoading } = useSessions(filters);

  // Check if we have any sessions at all (unfiltered)
  const { sessions: allSessions } = useSessions();
  const hasAnySessions = allSessions.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading sessions...</Text>
        </View>
      ) : !hasAnySessions ? (
        <View className="flex-1 items-center justify-center px-4">
          <Calendar color="#9ca3af" size={64} />
          <Text className="text-xl font-semibold text-gray-900 mt-4">
            No sessions yet
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Start tracking your BJJ training by logging your first session.
          </Text>
          <Link href="/sessions/new" asChild>
            <Pressable className="mt-6 bg-primary-600 rounded-xl px-6 py-3 flex-row items-center">
              <Plus color="#ffffff" size={20} />
              <Text className="text-white font-semibold ml-2">Log Session</Text>
            </Pressable>
          </Link>
        </View>
      ) : (
        <>
          <SessionFilters filters={filters} onFiltersChange={setFilters} />
          {sessions.length === 0 ? (
            <View className="flex-1 items-center justify-center px-4">
              <Text className="text-gray-500 text-center">
                No sessions match your filters.
              </Text>
              <Pressable
                onPress={() => setFilters({})}
                className="mt-3"
              >
                <Text className="text-primary-600 font-medium">Clear Filters</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={sessions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <SessionCard session={item} />}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
              ItemSeparatorComponent={() => <View className="h-3" />}
            />
          )}
        </>
      )}

      {/* Floating Action Button */}
      {hasAnySessions && (
        <Link href="/sessions/new" asChild>
          <Pressable className="absolute bottom-6 right-6 bg-primary-600 rounded-full w-14 h-14 items-center justify-center shadow-lg">
            <Plus color="#ffffff" size={28} />
          </Pressable>
        </Link>
      )}
    </SafeAreaView>
  );
}
