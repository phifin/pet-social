import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useState } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

const ProductCard = ({ item, handleProductClick, toggleFavorite }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleProductClick(item)}
    >
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
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    position: "relative",
  },
  coverImage: {
    height: 256,
    width: "100%",
    borderRadius: 20,
  },
  contentContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#444444",
  },
  price: {
    fontSize: 18,
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
    height: 20,
    borderRadius: 5,
    marginBottom: 5,
  },
  pricePlaceholder: {
    width: "40%",
    height: 20,
    borderRadius: 5,
  },
});
