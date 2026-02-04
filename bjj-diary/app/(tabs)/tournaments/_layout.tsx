import { Stack } from "expo-router";

export default function TournamentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#4f46e5" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Tournaments" }} />
      <Stack.Screen name="new" options={{ title: "Add Tournament", presentation: "modal" }} />
      <Stack.Screen name="[id]" options={{ title: "Tournament Details" }} />
    </Stack>
  );
}
