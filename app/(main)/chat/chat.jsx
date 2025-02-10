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

          // 🔥 Chỉ thêm tin nhắn nếu nó không phải do chính user hiện tại gửi
          if (newMsg.user._id !== user.id) {
            setMessages((prevMessages) =>
              prevMessages.some((msg) => msg._id === newMsg._id)
                ? prevMessages
                : GiftedChat.append(prevMessages, [newMsg])
            );
          }
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

  // ✅ Chỉ cập nhật state sau khi gửi thành công, tránh gửi trùng lặp
  const onSend = useCallback(
    async (newMessages = []) => {
      const message = newMessages[0];

      try {
        const sentMessage = await channel.sendMessage({ text: message.text });

        // Chỉ cập nhật state với tin nhắn đã gửi thành công
        const newMsg = {
          _id: sentMessage.message.id,
          text: sentMessage.message.text,
          createdAt: new Date(sentMessage.message.created_at),
          user: {
            _id: sentMessage.message.user.id,
            name: sentMessage.message.user.name,
            avatar: sentMessage.message.user.image,
          },
        };

        setMessages((prevMessages) =>
          GiftedChat.append(prevMessages, [newMsg])
        );
      } catch (error) {
        console.error("Error sending message:", error);
      }
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
