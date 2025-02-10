import { useEffect } from "react";
import { Tabs, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TabBar from "../../components/TabBar";
import { chatClient } from "../../services/streamChat";
import { useAuth } from "../../contexts/AuthContext";

export default function TabsLayout() {
  const segments = useSegments(); // Lấy đường dẫn hiện tại
  const { user } = useAuth(); // Lấy thông tin user từ context

  const hiddenRoutes = ["newPost", "dogFilter", "notifications"];
  const hideTabBar = segments.some((segment) => hiddenRoutes.includes(segment));

  useEffect(() => {
    // Nếu có user, kết nối Stream Chat
    if (user) {
      const connectChat = async () => {
        try {
          await chatClient.connectUser(
            {
              id: user.id,
              name: user.name,
              image: user.image,
            },
            chatClient.devToken(user.id) // Token từ backend
          );
          console.log("Stream Chat connected!");
        } catch (error) {
          console.error("Stream Chat connection error:", error);
        }
      };
      connectChat();
    }

    return () => {
      if (chatClient.userID) {
        chatClient.disconnectUser();
        console.log("Stream Chat disconnected!");
      }
    };
  }, [user]);

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
