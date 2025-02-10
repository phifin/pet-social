import { useEffect } from "react";
import { Tabs, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TabBar from "../../components/TabBar";
import { chatClient } from "../../services/streamChat";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { supabaseAnonKey } from "../../constants";

export default function TabsLayout() {
  const segments = useSegments(); // Lấy đường dẫn hiện tại
  const { user } = useAuth(); // Lấy thông tin user từ context

  const hiddenRoutes = ["newPost", "dogFilter", "notifications"];
  const hideTabBar = segments.some((segment) => hiddenRoutes.includes(segment));

  const fetchToken = async (userId) => {
    if (!userId) {
      console.error("Lỗi: userId không hợp lệ!");
      return null;
    }

    try {
      console.log("Fetching token for user:", userId);
      const response = await axios.post(
        "https://hndsyfpmtikfmvltvavq.supabase.co/functions/v1/generateToken",
        { user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Token received:", response.data.token);
      return response.data.token;
    } catch (error) {
      console.error("Lỗi khi lấy token từ Supabase:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!user) {
      console.warn("Chưa có user, không kết nối Stream Chat.");
      return;
    }

    const connectChat = async () => {
      try {
        // console.log("user id", user.id);
        const token = await fetchToken(user.id);
        if (!token) {
          console.error("Không lấy được token từ Supabase");
          return;
        }

        await chatClient.connectUser(
          {
            id: user.id,
            name: user.name,
            image: user.image,
          },
          token
        );
        console.log("Stream Chat connected!");
      } catch (error) {
        console.error("Stream Chat connection error:", error);
      }
    };

    connectChat();

    return () => {
      if (chatClient?.userID) {
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
