import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { chatClient } from "../../../services/streamChat";

export default function ChatListScreen() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Lấy danh sách tất cả user có trên Stream Chat
        const response = await chatClient.queryUsers({});
        setUsers(response.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
      onPress={() => router.push(`/chat/${item.id}`)} // Điều hướng đến màn hình chat
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/50" }}
        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
      />
      <Text style={{ fontSize: 16 }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}
