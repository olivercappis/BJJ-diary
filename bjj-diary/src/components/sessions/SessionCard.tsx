import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { format } from "date-fns";
import { Clock, Flame } from "lucide-react-native";
import { Session } from "../../types";

const typeLabels: Record<string, string> = {
  gi: "Gi",
  "no-gi": "No-Gi",
  "open-mat": "Open Mat",
  private: "Private",
  "competition-training": "Comp Training",
  seminar: "Seminar",
};

export function SessionCard({ session }: { session: Session }) {
  return (
    <Link href={`/sessions/${session.id}`} asChild>
      <Pressable className="bg-white rounded-xl p-4 shadow-sm">
        <View className="flex-row justify-between items-start mb-2">
          <View>
            <Text className="text-lg font-semibold text-gray-900">
              {typeLabels[session.type] || session.type}
            </Text>
            <Text className="text-gray-500 text-sm">
              {format(new Date(session.date), "EEE, MMM d, yyyy")}
            </Text>
          </View>
          <View className="bg-primary-100 px-3 py-1 rounded-full">
            <Text className="text-primary-700 font-medium">{session.duration} min</Text>
          </View>
        </View>
        <View className="flex-row gap-4">
          {session.intensity && (
            <View className="flex-row items-center">
              <Flame color="#ef4444" size={16} />
              <Text className="text-gray-600 text-sm ml-1">{session.intensity}/10</Text>
            </View>
          )}
          {session.sparringRounds && session.sparringRounds > 0 && (
            <View className="flex-row items-center">
              <Clock color="#3b82f6" size={16} />
              <Text className="text-gray-600 text-sm ml-1">{session.sparringRounds} rounds</Text>
            </View>
          )}
        </View>
        {session.focus && (
          <Text className="text-gray-600 text-sm mt-2" numberOfLines={1}>
            Focus: {session.focus}
          </Text>
        )}
      </Pressable>
    </Link>
  );
}
