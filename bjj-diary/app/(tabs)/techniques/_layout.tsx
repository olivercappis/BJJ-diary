import { Stack } from "expo-router";

export default function TechniquesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4f46e5",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Technique Library",
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: "Add Technique",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Technique Details",
        }}
      />
    </Stack>
  );
}
