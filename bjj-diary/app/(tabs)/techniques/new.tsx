import { View, Text, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTechniques } from "../../../src/hooks/useTechniques";
import { TechniqueCategory, Position } from "../../../src/types";

const CATEGORIES: { value: TechniqueCategory; label: string }[] = [
  { value: "submission", label: "Submission" },
  { value: "sweep", label: "Sweep" },
  { value: "pass", label: "Pass" },
  { value: "escape", label: "Escape" },
  { value: "takedown", label: "Takedown" },
  { value: "guard", label: "Guard" },
  { value: "control", label: "Control" },
  { value: "transition", label: "Transition" },
];

const POSITIONS: { value: Position; label: string }[] = [
  { value: "closed-guard", label: "Closed Guard" },
  { value: "open-guard", label: "Open Guard" },
  { value: "half-guard", label: "Half Guard" },
  { value: "mount", label: "Mount" },
  { value: "side-control", label: "Side Control" },
  { value: "back-control", label: "Back Control" },
  { value: "standing", label: "Standing" },
  { value: "turtle", label: "Turtle" },
  { value: "other", label: "Other" },
];

export default function NewTechniqueScreen() {
  const router = useRouter();
  const { createTechnique } = useTechniques();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<TechniqueCategory>("submission");
  const [position, setPosition] = useState<Position>("closed-guard");
  const [giOnly, setGiOnly] = useState(false);
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Required Field", "Please enter a technique name.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTechnique({
        name: name.trim(),
        category,
        position,
        giOnly,
        description: description || undefined,
        notes: notes || undefined,
        proficiencyLevel: 1,
      });
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save technique. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <ScrollView className="flex-1 px-4 py-4">
        {/* Name */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., Armbar, Triangle, Scissor Sweep"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
          />
        </View>

        {/* Category */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Category *</Text>
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <Pressable
                key={item.value}
                onPress={() => setCategory(item.value)}
                className={`px-4 py-2 rounded-full ${
                  category === item.value ? "bg-primary-600" : "bg-white border border-gray-200"
                }`}
              >
                <Text className={category === item.value ? "text-white font-medium" : "text-gray-700"}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Position */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Position *</Text>
          <View className="flex-row flex-wrap gap-2">
            {POSITIONS.map((item) => (
              <Pressable
                key={item.value}
                onPress={() => setPosition(item.value)}
                className={`px-4 py-2 rounded-full ${
                  position === item.value ? "bg-primary-600" : "bg-white border border-gray-200"
                }`}
              >
                <Text className={position === item.value ? "text-white font-medium" : "text-gray-700"}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Gi Only */}
        <View className="mb-6">
          <Pressable
            onPress={() => setGiOnly(!giOnly)}
            className="flex-row items-center"
          >
            <View className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
              giOnly ? "bg-primary-600 border-primary-600" : "border-gray-300"
            }`}>
              {giOnly && <Text className="text-white text-xs">✓</Text>}
            </View>
            <Text className="text-gray-700">Gi-only technique</Text>
          </Pressable>
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description of the technique"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 min-h-[80px]"
          />
        </View>

        {/* Notes */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Key details, setups, common mistakes..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 min-h-[100px]"
          />
        </View>

        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          className={`rounded-xl py-4 items-center mb-8 ${isSubmitting ? "bg-gray-400" : "bg-primary-600"}`}
        >
          <Text className="text-white font-semibold text-lg">
            {isSubmitting ? "Saving..." : "Save Technique"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
