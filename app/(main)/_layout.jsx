import { useEffect } from "react";
import { Tabs, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { OverlayProvider, Chat } from "stream-chat-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TabBar from "../../components/TabBar";
import { chatClient } from "../../services/streamChat";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { supabaseAnonKey } from "../../constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getPublicImageUrl } from "../../lib/supabase";

// Tạo instance của QueryClient
const queryClient = new QueryClient();

export default function TabsLayout() {
  const segments = useSegments();
  const { user } = useAuth();

  const hiddenRoutes = ["newPost", "dogFilter", "notifications", "chat"];
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
        const token = await fetchToken(user.id);
        if (!token) {
          console.error("Không lấy được token từ Supabase");
          return;
        }

        await chatClient.connectUser(
          {
            id: user.id,
            name: user.name,
            image: getPublicImageUrl(user.image),
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
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <OverlayProvider>
          <Chat client={chatClient}>
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
                    <Ionicons
                      name="chatbubble-outline"
                      size={size}
                      color={color}
                    />
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
          </Chat>
        </OverlayProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
