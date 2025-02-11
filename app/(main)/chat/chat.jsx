import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Channel,
  MessageInput,
  MessageList,
  useChatContext,
} from "stream-chat-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../../contexts/AuthContext";

export default function ChatScreen() {
  const { channelId } = useLocalSearchParams();
  const { user } = useAuth();
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);
  const [chatPartnerName, setChatPartnerName] = useState("Chat");

  useEffect(() => {
    if (!user) {
      console.error("Missing user:", { user });
      return;
    }

    const fetchChannel = async () => {
      try {
        const channels = await client.queryChannels({ cid: channelId });

        if (channels.length > 0) {
          const chatChannel = channels[0];
          setChannel(chatChannel);

          // Lấy tên người đang nhắn tin cùng
          const otherMember = Object.values(chatChannel.state.members).find(
            (member) => member.user_id !== user.id
          );

          setChatPartnerName(otherMember?.user?.name || "Chat");
        } else {
          console.error("Channel not found");
        }
      } catch (error) {
        console.error("Error fetching channel:", error);
      }
    };

    fetchChannel();
  }, [user]);

  if (!channel) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Tiêu đề Chat */}
      <View style={styles.header}>
        <Text style={styles.chatTitle}>{chatPartnerName}</Text>
        <Ionicons name="call" size={24} color="gray" />
      </View>

      {/* Đảm bảo rằng MessageList và MessageInput đều nằm bên trong Channel */}
      <Channel channel={channel} audioRecordingEnabled>
        <View style={styles.chatContainer}>
          <MessageList />
        </View>

        {/* Ô nhập tin nhắn luôn nằm dưới */}
        <SafeAreaView edges={["bottom"]} style={styles.messageInputContainer}>
          <MessageInput />
        </SafeAreaView>
      </Channel>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },
  chatContainer: {
    flex: 1, // Đảm bảo phần chat chiếm toàn bộ không gian còn lại
  },
  messageInputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 50,
  },
});
