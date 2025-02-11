import { Stack } from "expo-router";

export default function ShoppingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "PeTea Shop",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: "bold",
          color: "white", // Chữ màu trắng
        },
        headerStyle: {
          backgroundColor: "green", // Nền màu xanh lá
        },
      }}
    />
  );
}
