import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { getDetailProduct } from "../../../services/productService";
import { useLocalSearchParams } from "expo-router";

const ProductDetails = () => {
  const { productId } = useLocalSearchParams();

  // Fetch dữ liệu chi tiết sản phẩm
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["productDetails", productId],
    queryFn: () => getDetailProduct(productId),
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠️ Lỗi tải dữ liệu sản phẩm</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hình ảnh sản phẩm */}
      <Image source={{ uri: product.imageUrl }} style={styles.image} />

      {/* Nội dung sản phẩm */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.basePrice?.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Nút Thêm vào giỏ hàng */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>🛒 Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f8f8",
    paddingBottom: 20,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2f6828",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#073c0d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
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
});
