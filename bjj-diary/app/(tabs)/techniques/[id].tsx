import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trash2, Star } from "lucide-react-native";
import { useTechniques } from "../../../src/hooks/useTechniques";

export default function TechniqueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getTechnique, deleteTechnique, updateTechnique } = useTechniques();

  const technique = getTechnique(id);

  const handleDelete = () => {
    Alert.alert(
      "Delete Technique",
      "Are you sure you want to delete this technique?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteTechnique(id);
            router.back();
          },
        },
      ]
    );
  };

  const handleProficiencyChange = async (level: number) => {
    await updateTechnique(id, { proficiencyLevel: level });
  };

  if (!technique) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500">Technique not found</Text>
      </SafeAreaView>
    );
  }

  const categoryLabels: Record<string, string> = {
    submission: "Submission",
    sweep: "Sweep",
    pass: "Pass",
    escape: "Escape",
    takedown: "Takedown",
    guard: "Guard",
    control: "Control",
    transition: "Transition",
  };

  const positionLabels: Record<string, string> = {
    "closed-guard": "Closed Guard",
    "open-guard": "Open Guard",
    "half-guard": "Half Guard",
    mount: "Mount",
    "side-control": "Side Control",
    "back-control": "Back Control",
    standing: "Standing",
    turtle: "Turtle",
    other: "Other",
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <ScrollView className="flex-1 px-4 py-4">
        {/* Header */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {technique.name}
          </Text>
          <View className="flex-row gap-2">
            <View className="bg-primary-100 px-3 py-1 rounded-full">
              <Text className="text-primary-700 font-medium text-sm">
                {categoryLabels[technique.category]}
              </Text>
            </View>
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-gray-700 font-medium text-sm">
                {positionLabels[technique.position]}
              </Text>
            </View>
            {technique.giOnly && (
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-700 font-medium text-sm">Gi Only</Text>
              </View>
            )}
          </View>
        </View>

        {/* Proficiency */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <Text className="text-gray-700 font-medium mb-3">Proficiency Level</Text>
          <View className="flex-row gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <Pressable
                key={level}
                onPress={() => handleProficiencyChange(level)}
                className="flex-1 items-center"
              >
                <Star
                  size={32}
                  color={level <= technique.proficiencyLevel ? "#f59e0b" : "#d1d5db"}
                  fill={level <= technique.proficiencyLevel ? "#f59e0b" : "transparent"}
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Description */}
        {technique.description && (
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-gray-700 font-medium mb-2">Description</Text>
            <Text className="text-gray-900">{technique.description}</Text>
          </View>
        )}

        {/* Notes */}
        {technique.notes && (
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-gray-700 font-medium mb-2">Notes</Text>
            <Text className="text-gray-900">{technique.notes}</Text>
          </View>
        )}

        {/* Delete */}
        <Pressable
          onPress={handleDelete}
          className="bg-red-50 border border-red-200 rounded-xl py-3 flex-row items-center justify-center mt-4 mb-8"
        >
          <Trash2 color="#ef4444" size={20} />
          <Text className="text-red-600 font-semibold ml-2">Delete Technique</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
