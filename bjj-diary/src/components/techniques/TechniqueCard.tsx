import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { Star } from "lucide-react-native";
import { Technique } from "../../types";

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

export function TechniqueCard({ technique }: { technique: Technique }) {
  return (
    <Link href={`/techniques/${technique.id}`} asChild>
      <Pressable className="bg-white rounded-xl p-4 shadow-sm">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-lg font-semibold text-gray-900 flex-1">{technique.name}</Text>
          <View className="flex-row">
            {[1, 2, 3, 4, 5].map((level) => (
              <Star
                key={level}
                size={14}
                color={level <= technique.proficiencyLevel ? "#f59e0b" : "#d1d5db"}
                fill={level <= technique.proficiencyLevel ? "#f59e0b" : "transparent"}
              />
            ))}
          </View>
        </View>
        <View className="flex-row flex-wrap gap-2">
          <View className="bg-primary-100 px-2 py-1 rounded">
            <Text className="text-primary-700 text-xs font-medium">
              {categoryLabels[technique.category]}
            </Text>
          </View>
          <View className="bg-gray-100 px-2 py-1 rounded">
            <Text className="text-gray-700 text-xs font-medium">
              {positionLabels[technique.position]}
            </Text>
          </View>
          {technique.giOnly && (
            <View className="bg-blue-100 px-2 py-1 rounded">
              <Text className="text-blue-700 text-xs font-medium">Gi Only</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Link>
  );
}
