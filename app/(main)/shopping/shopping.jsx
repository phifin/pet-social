import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProduct } from "../../../services/productService";

const shopping = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get("http://localhost:7235/api/Product");
        const response = await axios.get(
          "http://192.168.0.101:5155/api/product"
        );

        setProducts(response.data);
        console.log("Fetched Products:", response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>shopping</Text>
    </View>
  );
};

export default shopping;

const styles = StyleSheet.create({});
