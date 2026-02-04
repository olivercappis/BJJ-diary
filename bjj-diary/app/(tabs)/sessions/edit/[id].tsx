import { View, Text, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useSessions } from "../../../../src/hooks/useSessions";
import { SessionType } from "../../../../src/types";

const SESSION_TYPES: { value: SessionType; label: string }[] = [
  { value: "gi", label: "Gi" },
  { value: "no-gi", label: "No-Gi" },
  { value: "open-mat", label: "Open Mat" },
  { value: "private", label: "Private" },
  { value: "competition-training", label: "Competition Training" },
  { value: "seminar", label: "Seminar" },
];

export default function EditSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSession, updateSession } = useSessions();

  const session = getSession(id);

  const [type, setType] = useState<SessionType>("gi");
  const [duration, setDuration] = useState("60");
  const [focus, setFocus] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [sparringRounds, setSparringRounds] = useState("");
  const [gym, setGym] = useState("");
  const [instructor, setInstructor] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate form with existing session data
  useEffect(() => {
    if (session) {
      setType(session.type);
      setDuration(session.duration.toString());
      setFocus(session.focus || "");
      setIntensity(session.intensity || 5);
      setSparringRounds(session.sparringRounds?.toString() || "");
      setGym(session.gym || "");
      setInstructor(session.instructor || "");
      setNotes(session.notes || "");
    }
  }, [session]);

  const handleSubmit = async () => {
    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert("Invalid Duration", "Please enter a valid duration in minutes.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateSession(id, {
        type,
        duration: durationNum,
        focus: focus || undefined,
        intensity,
        sparringRounds: sparringRounds ? parseInt(sparringRounds, 10) : undefined,
        gym: gym || undefined,
        instructor: instructor || undefined,
        notes: notes || undefined,
      });
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500">Session not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <ScrollView className="flex-1 px-4 py-4">
        {/* Date Display (read-only for now) */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Date</Text>
          <View className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3">
            <Text className="text-gray-700">
              {format(new Date(session.date), "EEEE, MMMM d, yyyy")}
            </Text>
          </View>
        </View>

        {/* Session Type */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Session Type *</Text>
          <View className="flex-row flex-wrap gap-2">
            {SESSION_TYPES.map((item) => (
              <Pressable
                key={item.value}
                onPress={() => setType(item.value)}
                className={`px-4 py-2 rounded-full ${
                  type === item.value ? "bg-primary-600" : "bg-white border border-gray-200"
                }`}
              >
                <Text className={`font-medium ${type === item.value ? "text-white" : "text-gray-700"}`}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Duration */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</Text>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            placeholder="60"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
          />
        </View>

        {/* Focus */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Focus / Theme</Text>
          <TextInput
            value={focus}
            onChangeText={setFocus}
            placeholder="e.g., Guard passing, Submissions"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
          />
        </View>

        {/* Intensity */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Intensity: {intensity}/10</Text>
          <View className="flex-row gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <Pressable
                key={level}
                onPress={() => setIntensity(level)}
                className={`flex-1 py-2 rounded ${level <= intensity ? "bg-primary-600" : "bg-gray-200"}`}
              >
                <Text className={`text-center text-xs font-medium ${level <= intensity ? "text-white" : "text-gray-500"}`}>
                  {level}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Sparring Rounds */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Sparring Rounds</Text>
          <TextInput
            value={sparringRounds}
            onChangeText={setSparringRounds}
            keyboardType="numeric"
            placeholder="0"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
          />
        </View>

        {/* Gym */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Gym</Text>
          <TextInput
            value={gym}
            onChangeText={setGym}
            placeholder="Enter gym name"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
          />
        </View>

        {/* Instructor */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Instructor</Text>
          <TextInput
            value={instructor}
            onChangeText={setInstructor}
            placeholder="Enter instructor name"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
          />
        </View>

        {/* Notes */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="What did you work on? Any breakthroughs?"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 min-h-[100px]"
          />
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          className={`rounded-xl py-4 items-center mb-8 ${isSubmitting ? "bg-gray-400" : "bg-primary-600"}`}
        >
          <Text className="text-white font-semibold text-lg">
            {isSubmitting ? "Saving..." : "Update Session"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
