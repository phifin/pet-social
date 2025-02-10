import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { chatClient } from "../../../services/streamChat";
import { useAuth } from "../../../contexts/AuthContext";
import { hp } from "../../../helpers/common";
import Avatar from "../../../components/Avatar";
import { theme } from "../../../constants/theme";

export default function ChatListScreen() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchUsersAndMessages = async () => {
      try {
        const response = await chatClient.queryUsers({});
        setUsers(response.users);

        const channels = await chatClient.queryChannels(
          {},
          { last_message_at: -1 }
        );

        const newUnreadCounts = {};
        const newLastMessages = {};

        for (const channel of channels) {
          const unreadCount = channel.countUnread();
          newUnreadCounts[channel.cid] = unreadCount;

          const lastMessage =
            channel.state.messages[channel.state.messages.length - 1];
          if (lastMessage) {
            newLastMessages[channel.cid] = {
              text: lastMessage.text,
              userId: lastMessage.user.id,
            };
          }
        }

        setUnreadCounts(newUnreadCounts);
        setLastMessages(newLastMessages);
      } catch (error) {
        console.error("Error fetching users and messages:", error);
      }
    };

    fetchUsersAndMessages();

    const handleNewMessage = async (event) => {
      const { cid, text, user: sender } = event.message;
      setUnreadCounts((prevCounts) => ({
        ...prevCounts,
        [cid]: (prevCounts[cid] || 0) + 1,
      }));

      setLastMessages((prevMessages) => ({
        ...prevMessages,
        [cid]: { text, userId: sender.id },
      }));
    };

    chatClient.on("message.new", handleNewMessage);

    return () => {
      chatClient.off("message.new", handleNewMessage);
    };
  }, [user]);

  const renderItem = ({ item }) => {
    console.log("item", item);
    const channelId = Object.keys(unreadCounts).find((cid) =>
      cid.includes(item.id)
    );
    const unreadMessages = channelId ? unreadCounts[channelId] : 0;
    const lastMessage = channelId ? lastMessages[channelId] : null;
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => {
          router.push({
            pathname: "/(main)/chat/chat",
            params: { userId: item.id },
          });

          if (channelId) {
            setUnreadCounts((prev) => ({ ...prev, [channelId]: 0 }));
          }
        }}
      >
        <Avatar size={hp(6.5)} uri={item?.image} rounded={theme.radius.md} />
        <View style={styles.chatInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          {lastMessage && (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage.userId === user.id ? "Bạn: " : ""}
              {lastMessage.text}
            </Text>
          )}
        </View>

        {unreadMessages > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadMessages}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tin nhắn</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  userName: {
    marginLeft: 7,
    fontSize: 16,
    fontWeight: "600",
  },
  lastMessage: {
    fontSize: 14,
    color: "#888",
  },
  unreadBadge: {
    backgroundColor: "red",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
