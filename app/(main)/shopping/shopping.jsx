import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllProduct,
  getFavoriteList,
  addProductToFavor,
} from "../../../services/productService";
import ProductCard from "../../../components/ProductCard";
import { useAuth } from "../../../contexts/AuthContext";

const Shopping = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch danh sách sản phẩm
  const {
    data: products,
    isLoading: isLoadingProducts,
    error: errorProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProduct,
  });

  // Fetch danh sách yêu thích
  const {
    data: favoriteList,
    isLoading: isLoadingFavorites,
    error: errorFavorites,
  } = useQuery({
    queryKey: ["favoriteList"],
    queryFn: () => getFavoriteList(user.id),
    enabled: !!user.id, // Chỉ chạy nếu user.id tồn tại
  });

  // Mutation để thêm sản phẩm vào danh sách yêu thích
  const { mutate: addFavorite, isLoading: isAddingFavorite } = useMutation({
    mutationFn: ({ productId, customerId }) =>
      addProductToFavor({ productId, customerId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["favoriteList"]); // Refresh danh sách yêu thích
    },
  });

  // Gộp dữ liệu danh sách sản phẩm với trạng thái yêu thích
  const enrichedProducts =
    products?.map((product) => ({
      ...product,
      isFavorite:
        favoriteList?.some((fav) => fav.productId === product.id) || false,
    })) || [];
  // console.log("favorite product", favoriteList);
  const handleProductClick = (product) => {
    console.log("Clicked on product:", product.title);
  };

  const toggleFavorite = (product) => {
    if (!user?.id) {
      console.error("❌ Error: User ID is missing!");
      return;
    }

    console.log("🔄 Toggling favorite:", {
      productId: product.id,
      customerId: user.id,
    });

    addFavorite({ productId: product.id, customerId: user.id });
  };

  // Hiển thị lỗi nếu fetch thất bại
  if (errorProducts || errorFavorites) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Lỗi khi tải dữ liệu:{" "}
          {errorProducts?.message || errorFavorites?.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách sản phẩm</Text>
      <FlatList
        data={enrichedProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            handleProductClick={handleProductClick}
            toggleFavorite={toggleFavorite}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default Shopping;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
});
