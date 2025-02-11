import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavoriteList } from "../../../services/productService";
import { addProductToFavor } from "../../../services/productService";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "expo-router";

const FavoriteList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch danh sách yêu thích
  const {
    data: favorites,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["favorites", user.id],
    queryFn: () => getFavoriteList(user.id),
  });

  // Mutation để xóa sản phẩm khỏi danh sách yêu thích
  const mutation = useMutation({
    mutationFn: addProductToFavor,
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites", user.id]); // Cập nhật danh sách
      Alert.alert(
        "❤️ Đã xóa",
        "Sản phẩm đã được xóa khỏi danh sách yêu thích."
      );
    },
    onError: () => {
      Alert.alert("❌ Lỗi", "Không thể xóa sản phẩm khỏi danh sách yêu thích.");
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải danh sách yêu thích...</Text>
      </View>
    );
  }

  if (error || !favorites?.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Danh sách yêu thích trống!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() =>
              router.push({
                pathname: "/(main)/shopping/productDetails",
                params: { productId: item.product.id },
              })
            }
          >
            <Image
              source={{ uri: item.product.imageUrl }}
              style={styles.image}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.product.name}</Text>
              <Text style={styles.price}>
                ${item.product.basePrice?.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() =>
                mutation.mutate({
                  customerId: user.id,
                  productId: item.product.id,
                })
              }
            >
              <Text style={styles.removeText}>❌</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default FavoriteList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10, marginLeft: 5 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d9534f",
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  price: {
    fontSize: 14,
    color: "#2f6828",
  },
  removeButton: {
    padding: 8,
  },
  removeText: {
    fontSize: 20,
    color: "#d9534f",
  },
});
