import { Tabs, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TabBar from "../../components/TabBar";

export default function TabsLayout() {
  const segments = useSegments(); // Lấy đường dẫn hiện tại

  const hiddenRoutes = ["newPost", "dogFilter", "notifications"];

  // Kiểm tra nếu đang ở màn hình cần ẩn tabBar
  const hideTabBar = segments.some((segment) => hiddenRoutes.includes(segment));

  return (
    <Tabs
      tabBar={(props) => (hideTabBar ? null : <TabBar {...props} />)}
      screenOptions={{
        headerShown: false,
        tabBarStyle: hideTabBar
          ? { display: "none" }
          : { backgroundColor: "#fff", height: 60 },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarActiveTintColor: "#007AFF",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          tabBarLabel: "Shop",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
