import { View, Text, ScrollView, Pressable } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, TrendingUp, Calendar, Award, Flame } from "lucide-react-native";
import { format } from "date-fns";
import { useSessions } from "../../src/hooks/useSessions";
import { useSessionStats } from "../../src/hooks/useSessionStats";
import { useTournaments } from "../../src/hooks/useTournaments";

export default function Dashboard() {
  const { sessions } = useSessions();
  const { stats } = useSessionStats();
  const { tournaments } = useTournaments();

  // Get recent sessions (last 3)
  const recentSessions = sessions.slice(0, 3);

  // Calculate tournament record
  const tournamentRecord = tournaments.reduce(
    (acc, t) => {
      if (t.placement === 1) acc.gold++;
      else if (t.placement === 2) acc.silver++;
      else if (t.placement === 3) acc.bronze++;
      return acc;
    },
    { gold: 0, silver: 0, bronze: 0 }
  );

  const sessionTypeLabels: Record<string, string> = {
    gi: "Gi",
    "no-gi": "No-Gi",
    "open-mat": "Open Mat",
    private: "Private",
    "competition-training": "Comp Training",
    seminar: "Seminar",
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <ScrollView className="flex-1 px-4 py-6">
        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Quick Actions
          </Text>
          <View className="flex-row gap-3">
            <Link href="/sessions/new" asChild>
              <Pressable className="flex-1 bg-primary-600 rounded-xl p-4 flex-row items-center justify-center">
                <Plus color="#ffffff" size={20} />
                <Text className="text-white font-semibold ml-2">Log Session</Text>
              </Pressable>
            </Link>
            <Link href="/techniques/new" asChild>
              <Pressable className="flex-1 bg-primary-100 rounded-xl p-4 flex-row items-center justify-center">
                <Plus color="#4f46e5" size={20} />
                <Text className="text-primary-700 font-semibold ml-2">Add Technique</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Stats Overview */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            This Month
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-2">
                <Calendar color="#4f46e5" size={20} />
                <Text className="text-gray-500 text-sm ml-2">Sessions</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {stats?.sessionsThisMonth || 0}
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-2">
                <TrendingUp color="#10b981" size={20} />
                <Text className="text-gray-500 text-sm ml-2">Hours</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {stats?.hoursThisMonth || 0}
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-2">
                <Flame color="#f59e0b" size={20} />
                <Text className="text-gray-500 text-sm ml-2">Streak</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {stats?.currentStreak || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* All Time Stats */}
        {stats && stats.totalSessions > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              All Time
            </Text>
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-500">Total Sessions</Text>
                <Text className="font-semibold text-gray-900">{stats.totalSessions}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-500">Total Hours</Text>
                <Text className="font-semibold text-gray-900">{stats.totalHours}h</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-500">Avg Duration</Text>
                <Text className="font-semibold text-gray-900">{stats.averageDuration} min</Text>
              </View>
              {stats.averageIntensity > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Avg Intensity</Text>
                  <Text className="font-semibold text-gray-900">{stats.averageIntensity}/10</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Recent Sessions */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-900">
              Recent Sessions
            </Text>
            <Link href="/sessions" asChild>
              <Pressable>
                <Text className="text-primary-600 font-medium">View All</Text>
              </Pressable>
            </Link>
          </View>
          {recentSessions.length === 0 ? (
            <View className="bg-white rounded-xl p-6 shadow-sm items-center">
              <Text className="text-gray-400 text-center">
                No sessions yet.{"\n"}Start tracking your training!
              </Text>
              <Link href="/sessions/new" asChild>
                <Pressable className="mt-4 bg-primary-600 rounded-lg px-4 py-2">
                  <Text className="text-white font-medium">Log First Session</Text>
                </Pressable>
              </Link>
            </View>
          ) : (
            <View className="gap-2">
              {recentSessions.map((session) => (
                <Link key={session.id} href={`/sessions/${session.id}`} asChild>
                  <Pressable className="bg-white rounded-xl p-4 shadow-sm flex-row justify-between items-center">
                    <View>
                      <Text className="font-semibold text-gray-900">
                        {sessionTypeLabels[session.type] || session.type}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {format(new Date(session.date), "EEE, MMM d")}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-primary-600 font-medium">{session.duration} min</Text>
                      {session.intensity && (
                        <Text className="text-gray-400 text-sm">{session.intensity}/10</Text>
                      )}
                    </View>
                  </Pressable>
                </Link>
              ))}
            </View>
          )}
        </View>

        {/* Tournament Record */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-900">
              Tournament Record
            </Text>
            <Link href="/tournaments" asChild>
              <Pressable>
                <Text className="text-primary-600 font-medium">View All</Text>
              </Pressable>
            </Link>
          </View>
          <View className="bg-white rounded-xl p-4 shadow-sm flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-yellow-500">{tournamentRecord.gold}</Text>
              <Text className="text-gray-500 text-sm">Gold</Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-400">{tournamentRecord.silver}</Text>
              <Text className="text-gray-500 text-sm">Silver</Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="items-center">
              <Text className="text-2xl font-bold text-amber-600">{tournamentRecord.bronze}</Text>
              <Text className="text-gray-500 text-sm">Bronze</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
