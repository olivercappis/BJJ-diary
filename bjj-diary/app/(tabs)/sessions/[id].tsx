import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";
import { Clock, Flame, Target, MapPin, User, Trash2, Edit2 } from "lucide-react-native";
import { useSessions } from "../../../src/hooks/useSessions";

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSession, deleteSession } = useSessions();

  const session = getSession(id);

  const handleDelete = () => {
    Alert.alert(
      "Delete Session",
      "Are you sure you want to delete this session? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteSession(id);
            router.back();
          },
        },
      ]
    );
  };

  if (!session) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500">Session not found</Text>
      </SafeAreaView>
    );
  }

  const sessionTypeLabels: Record<string, string> = {
    gi: "Gi",
    "no-gi": "No-Gi",
    "open-mat": "Open Mat",
    private: "Private",
    "competition-training": "Competition Training",
    seminar: "Seminar",
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <ScrollView className="flex-1 px-4 py-4">
        {/* Header Card */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <View className="flex-row justify-between items-start mb-3">
            <View>
              <Text className="text-xl font-bold text-gray-900">
                {sessionTypeLabels[session.type] || session.type}
              </Text>
              <Text className="text-gray-500">
                {format(new Date(session.date), "EEEE, MMMM d, yyyy")}
              </Text>
            </View>
            <View className="bg-primary-100 px-3 py-1 rounded-full">
              <Text className="text-primary-700 font-medium">
                {session.duration} min
              </Text>
            </View>
          </View>
        </View>

        {/* Details Grid */}
        <View className="flex-row flex-wrap gap-3 mb-4">
          {session.intensity && (
            <View className="bg-white rounded-xl p-4 shadow-sm flex-row items-center flex-1 min-w-[45%]">
              <Flame color="#ef4444" size={24} />
              <View className="ml-3">
                <Text className="text-gray-500 text-sm">Intensity</Text>
                <Text className="text-gray-900 font-semibold">
                  {session.intensity}/10
                </Text>
              </View>
            </View>
          )}
          {session.sparringRounds !== undefined && session.sparringRounds > 0 && (
            <View className="bg-white rounded-xl p-4 shadow-sm flex-row items-center flex-1 min-w-[45%]">
              <Clock color="#3b82f6" size={24} />
              <View className="ml-3">
                <Text className="text-gray-500 text-sm">Sparring</Text>
                <Text className="text-gray-900 font-semibold">
                  {session.sparringRounds} rounds
                </Text>
              </View>
            </View>
          )}
          {session.gym && (
            <View className="bg-white rounded-xl p-4 shadow-sm flex-row items-center flex-1 min-w-[45%]">
              <MapPin color="#10b981" size={24} />
              <View className="ml-3">
                <Text className="text-gray-500 text-sm">Gym</Text>
                <Text className="text-gray-900 font-semibold">{session.gym}</Text>
              </View>
            </View>
          )}
          {session.instructor && (
            <View className="bg-white rounded-xl p-4 shadow-sm flex-row items-center flex-1 min-w-[45%]">
              <User color="#8b5cf6" size={24} />
              <View className="ml-3">
                <Text className="text-gray-500 text-sm">Instructor</Text>
                <Text className="text-gray-900 font-semibold">
                  {session.instructor}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Focus */}
        {session.focus && (
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <View className="flex-row items-center mb-2">
              <Target color="#f59e0b" size={20} />
              <Text className="text-gray-700 font-medium ml-2">Focus</Text>
            </View>
            <Text className="text-gray-900">{session.focus}</Text>
          </View>
        )}

        {/* Notes */}
        {session.notes && (
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-gray-700 font-medium mb-2">Notes</Text>
            <Text className="text-gray-900">{session.notes}</Text>
          </View>
        )}

        {/* Actions */}
        <View className="flex-row gap-3 mt-4 mb-8">
          <Link href={`/sessions/edit/${id}`} asChild>
            <Pressable className="flex-1 bg-primary-50 border border-primary-200 rounded-xl py-3 flex-row items-center justify-center">
              <Edit2 color="#4f46e5" size={20} />
              <Text className="text-primary-600 font-semibold ml-2">Edit</Text>
            </Pressable>
          </Link>
          <Pressable
            onPress={handleDelete}
            className="flex-1 bg-red-50 border border-red-200 rounded-xl py-3 flex-row items-center justify-center"
          >
            <Trash2 color="#ef4444" size={20} />
            <Text className="text-red-600 font-semibold ml-2">Delete</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
