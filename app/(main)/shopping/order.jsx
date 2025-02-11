import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getAllOrder } from "../../../services/productService";
import { useAuth } from "../../../contexts/AuthContext";
import moment from "moment";

const OrderList = () => {
  const { user } = useAuth();

  // Fetch danh sách đơn hàng
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", user.id],
    queryFn: () => getAllOrder(user.id),
    enabled: !!user.id,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Lỗi tải đơn hàng: {error.message}</Text>
      </View>
    );
  }
  //   console.log("ỏder", orders);
  // Nhóm đơn hàng theo ngày
  const groupedOrders = orders?.reduce((acc, order) => {
    const orderDate = moment(order.orderDate).format("YYYY-MM-DD");
    if (!acc[orderDate]) {
      acc[orderDate] = [];
    }
    acc[orderDate].push(order);
    return acc;
  }, {});

  return (
    <FlatList
      data={Object.keys(groupedOrders).sort((a, b) =>
        moment(b).diff(moment(a))
      )}
      keyExtractor={(date) => date}
      renderItem={({ item: date }) => (
        <View>
          <Text style={styles.dateHeader}>
            {moment(date).format("DD/MM/YYYY")}
          </Text>
          {groupedOrders[date].map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <Text style={styles.orderText}>Mã đơn: {order.id}</Text>
              <Text style={styles.orderText}>Tổng tiền: {order.total} VND</Text>
              <Text style={styles.orderText}>
                Trạng thái: {getStatusText(order.status)}
              </Text>
            </View>
          ))}
        </View>
      )}
    />
  );
};

const getStatusText = (status) => {
  switch (status) {
    case 0:
      return "Chờ xác nhận";
    case 2:
      return "Đang giao hàng";
    case 4:
      return "Hoàn thành";
    default:
      return "Không xác định";
  }
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#f1f1f1",
    padding: 10,
    marginTop: 10,
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  orderText: {
    fontSize: 16,
  },
});

export default OrderList;
