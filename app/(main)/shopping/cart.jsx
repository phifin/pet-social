import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCart } from "../../../services/productService";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "expo-router";
import {
  checkout,
  finishPayment,
  createPaymentUrl,
} from "../../../services/productService";
import { Linking } from "react-native";
const CartScreen = () => {
  const { user } = useAuth();
  const router = useRouter();

  // Fetch giỏ hàng
  const {
    data: cartData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart", user.id],
    queryFn: () => getCart(user.id),
    enabled: !!user.id,
  });

  // Trạng thái lựa chọn phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState("cod");

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
      </View>
    );
  }

  if (error || !cartData?.cartItems?.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Giỏ hàng của bạn đang trống!</Text>
      </View>
    );
  }

  // Tính tổng tiền
  const totalPrice = cartData.cartItems.reduce(
    (sum, item) => sum + item.product.basePrice * item.quantity,
    0
  );

  // Xử lý thanh toán
  const queryClient = useQueryClient();
  const handleCompletePayment = async () => {
    try {
      // Gọi API checkout để tạo đơn hàng
      const checkoutResponse = await checkout({
        userId: user.id,
        cartItems: cartData.cartItems.map((item) => item.id),
      });

      if (!checkoutResponse || !checkoutResponse.id) {
        Alert.alert("Lỗi", "Không thể tạo đơn hàng. Vui lòng thử lại.");
        return;
      }

      const orderId = checkoutResponse.id;

      if (paymentMethod === "cod") {
        // Nếu chọn Ship COD, gọi API finishPayment
        await finishPayment({
          orderId: orderId,
          paymentMethod: 0,
        });

        Alert.alert(
          "✅ Thanh toán thành công",
          "Đơn hàng đã được đặt thành công!"
        );

        // Cập nhật lại giỏ hàng sau khi thanh toán xong
        queryClient.invalidateQueries(["cart", user.id]);
      } else {
        // Nếu chọn thanh toán online, gọi API createPaymentUrl
        const paymentUrlResponse = await createPaymentUrl({
          money: totalPrice,
          orderId: orderId,
        });

        if (paymentUrlResponse?.data) {
          // Redirect người dùng đến trang thanh toán
          Linking.openURL(paymentUrlResponse.data);

          // Khi người dùng quay lại app sau thanh toán online -> refetch giỏ hàng
          Linking.addEventListener("url", () => {
            queryClient.invalidateQueries(["cart", user.id]);
          });
        } else {
          Alert.alert(
            "Lỗi",
            "Không thể tạo link thanh toán. Vui lòng thử lại."
          );
        }
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      Alert.alert(
        "Lỗi",
        "Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={cartData.cartItems}
        keyExtractor={(item) => item.product.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: item.product.imageUrl }}
              style={styles.image}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.product.name}</Text>
              <View style={styles.priceContainer}>
                <View style={styles.quantityBox}>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                </View>
                <Text style={styles.price}>
                  ${item.product.basePrice.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Phương thức thanh toán */}
      <View style={styles.paymentContainer}>
        <Text style={styles.paymentTitle}>Chọn phương thức thanh toán:</Text>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setPaymentMethod("cod")}
        >
          <View style={styles.radioCircle}>
            {paymentMethod === "cod" && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.radioText}>Ship COD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setPaymentMethod("online")}
        >
          <View style={styles.radioCircle}>
            {paymentMethod === "online" && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.radioText}>Online Payment</Text>
        </TouchableOpacity>
      </View>

      {/* Tổng tiền + nút thanh toán */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompletePayment}
        >
          <Text style={styles.completeText}>Complete Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 5,
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
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityBox: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2f6828",
  },
  paymentContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#295e40",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2f6e45",
  },
  radioText: {
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  completeButton: {
    backgroundColor: "#295836",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  completeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
