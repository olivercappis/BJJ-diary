import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Settings, Award, Calendar, TrendingUp } from "lucide-react-native";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <ScrollView className="flex-1 px-4 py-4">
        {/* Belt Display */}
        <View className="bg-white rounded-xl p-6 shadow-sm mb-4 items-center">
          <View className="w-24 h-8 bg-white border-4 border-gray-300 rounded mb-4" />
          <Text className="text-xl font-bold text-gray-900">White Belt</Text>
          <Text className="text-gray-500">0 Stripes</Text>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm items-center">
            <Calendar color="#4f46e5" size={24} />
            <Text className="text-2xl font-bold text-gray-900 mt-2">0</Text>
            <Text className="text-gray-500 text-sm">Total Sessions</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm items-center">
            <TrendingUp color="#10b981" size={24} />
            <Text className="text-2xl font-bold text-gray-900 mt-2">0h</Text>
            <Text className="text-gray-500 text-sm">Mat Time</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm items-center">
            <Award color="#f59e0b" size={24} />
            <Text className="text-2xl font-bold text-gray-900 mt-2">0</Text>
            <Text className="text-gray-500 text-sm">Techniques</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View className="bg-white rounded-xl shadow-sm mb-4">
          <Pressable className="flex-row items-center px-4 py-4 border-b border-gray-100">
            <Settings color="#6b7280" size={20} />
            <Text className="text-gray-900 ml-3 flex-1">App Settings</Text>
            <Text className="text-gray-400">›</Text>
          </Pressable>
          <Pressable className="flex-row items-center px-4 py-4">
            <Award color="#6b7280" size={20} />
            <Text className="text-gray-900 ml-3 flex-1">Belt History</Text>
            <Text className="text-gray-400">›</Text>
          </Pressable>
        </View>

        <Text className="text-center text-gray-400 text-sm mt-8">BJJ Diary v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
