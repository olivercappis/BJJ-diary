import { View, Text, FlatList, Pressable } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, BookOpen } from "lucide-react-native";
import { useTechniques } from "../../../src/hooks/useTechniques";
import { TechniqueCard } from "../../../src/components/techniques/TechniqueCard";

export default function TechniquesScreen() {
  const { techniques, isLoading } = useTechniques();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading techniques...</Text>
        </View>
      ) : techniques.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <BookOpen color="#9ca3af" size={64} />
          <Text className="text-xl font-semibold text-gray-900 mt-4">
            No techniques yet
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Build your technique library by adding moves you've learned.
          </Text>
          <Link href="/techniques/new" asChild>
            <Pressable className="mt-6 bg-primary-600 rounded-xl px-6 py-3 flex-row items-center">
              <Plus color="#ffffff" size={20} />
              <Text className="text-white font-semibold ml-2">Add Technique</Text>
            </Pressable>
          </Link>
        </View>
      ) : (
        <FlatList
          data={techniques}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TechniqueCard technique={item} />}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
        />
      )}

      {techniques.length > 0 && (
        <Link href="/techniques/new" asChild>
          <Pressable className="absolute bottom-6 right-6 bg-primary-600 rounded-full w-14 h-14 items-center justify-center shadow-lg">
            <Plus color="#ffffff" size={28} />
          </Pressable>
        </Link>
      )}
    </SafeAreaView>
  );
}
