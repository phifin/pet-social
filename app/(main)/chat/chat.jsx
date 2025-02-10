import React, { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useLocalSearchParams } from "expo-router";
import { chatClient } from "../../../services/streamChat";
import { useAuth } from "../../../contexts/AuthContext";

export default function ChatScreen() {
  const { userId } = useLocalSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (!user) return;

    const setupChat = async () => {
      try {
        const chatChannel = chatClient.channel("messaging", {
          members: [user.id, userId],
        });

        await chatChannel.watch();
        setChannel(chatChannel);

        // Load tin nhắn cũ
        const formattedMessages = chatChannel.state.messages.map((msg) => ({
          _id: msg.id,
          text: msg.text,
          createdAt: new Date(msg.created_at),
          user: {
            _id: msg.user.id,
            name: msg.user.name,
            avatar: msg.user.image,
          },
        }));

        setMessages(formattedMessages.reverse());

        // Lắng nghe tin nhắn mới
        const handleNewMessage = (event) => {
          const newMsg = {
            _id: event.message.id,
            text: event.message.text,
            createdAt: new Date(event.message.created_at),
            user: {
              _id: event.message.user.id,
              name: event.message.user.name,
              avatar: event.message.user.image,
            },
          };

          // 🔥 Kiểm tra nếu tin nhắn đã tồn tại thì không thêm lại
          setMessages((prevMessages) =>
            prevMessages.some((msg) => msg._id === newMsg._id)
              ? prevMessages
              : GiftedChat.append(prevMessages, [newMsg])
          );
        };

        chatChannel.on("message.new", handleNewMessage);

        return () => {
          chatChannel.off("message.new", handleNewMessage);
        };
      } catch (error) {
        console.error("Error setting up chat:", error);
      }
    };

    setupChat();

    return () => {
      if (channel) channel.stopWatching();
    };
  }, [user, userId]);

  // ✅ Fix gửi tin nhắn bị trùng lặp
  const onSend = useCallback(
    async (newMessages = []) => {
      const message = newMessages[0];

      // 🔥 Chỉ cập nhật state sau khi gửi thành công
      await channel.sendMessage({ text: message.text });

      setMessages((prevMessages) =>
        prevMessages.some((msg) => msg._id === message._id)
          ? prevMessages
          : GiftedChat.append(prevMessages, newMessages)
      );
    },
    [channel]
  );

  if (!channel) return <ActivityIndicator size="large" color="#007AFF" />;

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: user.id, name: user.name, avatar: user.image }}
        inverted={true}
      />
    </View>
  );
}
