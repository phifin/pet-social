import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { getCart } from "../../../services/productService";

import {
  fetchAllProduct,
  getFavoriteList,
  addProductToFavor,
} from "../../../services/productService";
import ProductCard from "../../../components/ProductCard";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "expo-router";

const Shopping = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const router = useRouter();

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
  // Fetch giỏ hàng
  const { data: cartData, isLoading: isLoadingCart } = useQuery({
    queryKey: ["cart", user.id],
    queryFn: () => getCart(user.id),
    enabled: !!user.id, // Chỉ chạy nếu user.id tồn tại
  });
  const cartItemCount = cartData?.cartItems?.length || 0;
  // Mutation để thêm sản phẩm vào danh sách yêu thích
  const { mutate: addFavorite, isLoading: isAddingFavorite } = useMutation({
    mutationFn: ({ productId, customerId }) =>
      addProductToFavor({ productId, customerId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["favoriteList"]); // Refresh danh sách yêu thích
    },
  });
  if (isLoadingProducts || isLoadingFavorites) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // Gộp dữ liệu danh sách sản phẩm với trạng thái yêu thích
  const enrichedProducts =
    products?.map((product) => ({
      ...product,
      isFavorite:
        favoriteList?.some((fav) => fav.productId === product.id) || false,
    })) || [];
  // console.log("favorite product", favoriteList);
  // const handleProductClick = (productId) => {
  //   router.push({
  //     pathname: "/(main)/shopping/productDetails",
  //     params: { productId: productId },
  //   });
  // };

  const toggleFavorite = (product) => {
    if (!user?.id) {
      console.error("❌ Error: User ID is missing!");
      return;
    }

    // console.log("🔄 Toggling favorite:", {
    //   productId: product.id,
    //   customerId: user.id,
    // });

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
      <View style={styles.header}>
        <Text style={styles.title}>Our Products</Text>
        <View style={styles.iconHeader}>
          <TouchableOpacity
            onPress={() => router.push("/(main)/shopping/favorList")}
          >
            <FontAwesome5
              name="heart"
              size={22}
              color="red"
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* Nút Cart */}
          <TouchableOpacity
            onPress={() => router.push("/(main)/shopping/cart")}
          >
            <View style={styles.cartIconContainer}>
              <FontAwesome5
                name="shopping-cart"
                size={22}
                color="gray"
                style={styles.icon}
              />
              {cartItemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItemCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={enrichedProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard item={item} toggleFavorite={toggleFavorite} />
        )}
        contentContainerStyle={styles.list}
        removeClippedSubviews={false}
        style={styles.productList}
      />
    </View>
  );
};

export default Shopping;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  // productList: {
  //   paddingTop: 5,
  // },
});
