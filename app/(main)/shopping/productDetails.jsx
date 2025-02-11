import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { getDetailProduct, addCart } from "../../../services/productService";
import { useAuth } from "../../../contexts/AuthContext";

const ProductDetails = () => {
  const { productId } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient(); // Khai báo queryClient

  const { user } = useAuth();

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

  // Xử lý tăng giảm số lượng
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async () => {
    try {
      await addCart({
        userId: user.id,
        productId,
        quantity,
      });

      // Cập nhật giỏ hàng sau khi thêm sản phẩm
      queryClient.invalidateQueries(["cart", user.id]);

      Alert.alert("🛒 Thành công", "Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
      Alert.alert("❌ Lỗi", "Không thể thêm sản phẩm vào giỏ hàng.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hình ảnh sản phẩm */}
      <Image source={{ uri: product.imageUrl }} style={styles.image} />

      {/* Nội dung sản phẩm */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.basePrice?.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Bộ chọn số lượng */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={decreaseQuantity}
          >
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={increaseQuantity}
          >
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Nút Thêm vào giỏ hàng */}
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
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
    paddingBottom: 80,
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
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 15,
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
