import { Stack } from "expo-router";

export default function SessionsLayout() {
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
          title: "Sessions",
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: "Log Session",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Session Details",
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Edit Session",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
