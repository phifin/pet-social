import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useLocalSearchParams } from "expo-router";
import { chatClient } from "../../../services/streamChat";
import { useAuth } from "../../../contexts/AuthContext";

export default function ChatScreen() {
  const { userId } = useLocalSearchParams(); // Lấy userId từ URL
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (!user) return;

    const setupChat = async () => {
      try {
        // Tạo hoặc lấy channel giữa user hiện tại và người kia
        const chatChannel = chatClient.channel("messaging", {
          members: [user.id, userId],
        });

        await chatChannel.watch();
        setChannel(chatChannel);

        // Load tin nhắn cũ
        setMessages(
          chatChannel.state.messages.map((msg) => ({
            _id: msg.id,
            text: msg.text,
            createdAt: new Date(msg.created_at),
            user: {
              _id: msg.user.id,
              name: msg.user.name,
              avatar: msg.user.image,
            },
          }))
        );
      } catch (error) {
        console.error("Error setting up chat:", error);
      }
    };

    setupChat();

    return () => {
      if (channel) channel.stopWatching();
    };
  }, [user, userId]);

  // Gửi tin nhắn
  const onSend = async (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    const message = newMessages[0];

    await channel.sendMessage({
      text: message.text,
    });
  };

  if (!channel) return <ActivityIndicator size="large" color="#007AFF" />;

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: user.id, name: user.name, avatar: user.image }}
      />
    </View>
  );
}
