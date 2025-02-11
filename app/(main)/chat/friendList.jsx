import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import { Chat, ChannelList, OverlayProvider } from "stream-chat-expo";
import { chatClient } from "../../../services/streamChat";
import { Text, StyleSheet, View } from "react-native";

export default function ChatListScreen() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <OverlayProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Chats</Text>
        <Chat client={chatClient}>
          <ChannelList
            filters={{ members: { $in: [user.id] } }}
            onSelect={(channel) =>
              router.push({
                pathname: "/(main)/chat/chat",
                params: { channelId: channel.cid }, // Truyền CID thay vì userId
              })
            }
          />
        </Chat>
      </View>
    </OverlayProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Màu nền nhẹ
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green", // Màu xanh đẹp
    textAlign: "center",
    marginBottom: 10,
  },
});
