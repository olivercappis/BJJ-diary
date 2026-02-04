import { View, Text, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTournaments } from "../../../src/hooks/useTournaments";
import { BeltRank } from "../../../src/types";

const BELT_RANKS: { value: BeltRank; label: string; color: string }[] = [
  { value: "white", label: "White", color: "#f3f4f6" },
  { value: "blue", label: "Blue", color: "#3b82f6" },
  { value: "purple", label: "Purple", color: "#8b5cf6" },
  { value: "brown", label: "Brown", color: "#92400e" },
  { value: "black", label: "Black", color: "#171717" },
];

export default function NewTournamentScreen() {
  const router = useRouter();
  const { createTournament } = useTournaments();

  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<"gi" | "no-gi">("gi");
  const [weightClass, setWeightClass] = useState("");
  const [beltRank, setBeltRank] = useState<BeltRank>("white");
  const [placement, setPlacement] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Required Field", "Please enter the tournament name.");
      return;
    }
    if (!weightClass.trim()) {
      Alert.alert("Required Field", "Please enter your weight class.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTournament({
        name: name.trim(),
        organization: organization || undefined,
        date: new Date(),
        location: location || undefined,
        type,
        weightClass: weightClass.trim(),
        beltRank,
        ageClass: "adult",
        division: `${beltRank.charAt(0).toUpperCase() + beltRank.slice(1)} Belt`,
        placement: placement ? parseInt(placement, 10) : undefined,
        notes: notes || undefined,
      });
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save tournament. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <ScrollView className="flex-1 px-4 py-4">
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Tournament Name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., IBJJF World Championship"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Organization</Text>
          <TextInput
            value={organization}
            onChangeText={setOrganization}
            placeholder="e.g., IBJJF, ADCC, Local"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Location</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="City, State/Country"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Type *</Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setType("gi")}
              className={`flex-1 py-3 rounded-xl items-center ${type === "gi" ? "bg-primary-600" : "bg-white border border-gray-200"}`}
            >
              <Text className={type === "gi" ? "text-white font-semibold" : "text-gray-700"}>Gi</Text>
            </Pressable>
            <Pressable
              onPress={() => setType("no-gi")}
              className={`flex-1 py-3 rounded-xl items-center ${type === "no-gi" ? "bg-primary-600" : "bg-white border border-gray-200"}`}
            >
              <Text className={type === "no-gi" ? "text-white font-semibold" : "text-gray-700"}>No-Gi</Text>
            </Pressable>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Belt Rank *</Text>
          <View className="flex-row flex-wrap gap-2">
            {BELT_RANKS.map((belt) => (
              <Pressable
                key={belt.value}
                onPress={() => setBeltRank(belt.value)}
                className={`px-4 py-2 rounded-full border-2 ${beltRank === belt.value ? "border-primary-600" : "border-gray-200"}`}
                style={{ backgroundColor: belt.color }}
              >
                <Text className={belt.value === "white" ? "text-gray-900 font-medium" : "text-white font-medium"}>
                  {belt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Weight Class *</Text>
          <TextInput
            value={weightClass}
            onChangeText={setWeightClass}
            placeholder="e.g., Featherweight, -76kg"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Placement</Text>
          <TextInput
            value={placement}
            onChangeText={setPlacement}
            placeholder="e.g., 1, 2, 3"
            keyboardType="numeric"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="How did it go? Key takeaways..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 min-h-[100px]"
          />
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          className={`rounded-xl py-4 items-center mb-8 ${isSubmitting ? "bg-gray-400" : "bg-primary-600"}`}
        >
          <Text className="text-white font-semibold text-lg">
            {isSubmitting ? "Saving..." : "Save Tournament"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
