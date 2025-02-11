import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useState } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { useRouter } from "expo-router";

const ProductCard = ({ item, toggleFavorite }) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleProductClick = () => {
    router.push({
      pathname: "/(main)/shopping/productDetails",
      params: { productId: item.id },
    });
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handleProductClick}>
      {/* Shimmer effect for image */}
      <ShimmerPlaceHolder visible={imageLoaded} style={styles.coverImage}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.coverImage}
          onLoad={() => setImageLoaded(true)}
        />
      </ShimmerPlaceHolder>

      {/* Product Details */}
      <View style={styles.contentContainer}>
        <ShimmerPlaceHolder
          visible={imageLoaded}
          style={styles.titlePlaceholder}
        >
          <Text style={styles.title}>{item.name}</Text>
        </ShimmerPlaceHolder>

        <ShimmerPlaceHolder
          visible={imageLoaded}
          style={styles.pricePlaceholder}
        >
          <Text style={styles.price}>${item.basePrice}</Text>
        </ShimmerPlaceHolder>
      </View>

      {/* Like Button */}
      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={() => toggleFavorite(item)}>
          <FontAwesome5
            name="heart"
            solid={item.isFavorite}
            color={item.isFavorite ? "red" : "gray"}
            size={20}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    width: "48%", // Giữ khoảng cách hợp lý giữa các item
    margin: 5,
    minHeight: 250,
  },
  coverImage: {
    height: 180,
    width: "100%",
    borderRadius: 10,
  },
  contentContainer: {
    padding: 8,
    flexShrink: 1, // Cho phép chữ co giãn
    alignItems: "flex-start",
    minHeight: 75,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444444",
    flexShrink: 1, // Tránh chữ bị mất
    // paddingBottom: 5,
  },
  price: {
    fontSize: 15,
  },
  likeContainer: {
    position: "absolute",
    padding: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    right: 10,
    top: 10,
  },
  titlePlaceholder: {
    width: "80%",
    height: 22,
    borderRadius: 5,
    marginBottom: 5,
  },
  pricePlaceholder: {
    width: "40%",
    height: 20,
    borderRadius: 5,
  },
});
