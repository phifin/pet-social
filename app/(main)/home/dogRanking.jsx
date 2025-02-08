import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { useRouter } from "expo-router";
import BackButton from "../../../components/BackButton";

const dogRanking = () => {
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [dogBreeds, setDogBreeds] = useState([
    { breed: "Golden Retriever", votes: 0 },
    { breed: "Poodle", votes: 1 },
    { breed: "German Shepherd", votes: 2 },
    { breed: "Bulldog", votes: 1 },
    { breed: "Beagle", votes: 3 },
    { breed: "Husky", votes: 4 },
    { breed: "Chihuahua", votes: 1 },
    { breed: "Dachshund", votes: 2 },
    { breed: "Shiba Inu", votes: 1 },
    { breed: "Corgi", votes: 4 },
  ]);

  // Hàm xử lý khi người dùng chọn giống chó
  const handleSelectBreed = (breed) => {
    if (selectedBreed === breed) return; // Nếu giống chó đã chọn rồi thì không làm gì cả

    setDogBreeds((prevBreeds) =>
      prevBreeds.map((item) => {
        if (item.breed === breed) {
          return { ...item, votes: item.votes + 1 }; // Tăng điểm cho giống chó được chọn
        }
        if (item.breed === selectedBreed) {
          return { ...item, votes: item.votes - 1 }; // Giảm điểm giống chó trước đó
        }
        return item;
      })
    );

    setSelectedBreed(breed); // Cập nhật giống chó được chọn
  };

  // Hàm sắp xếp giống chó theo số lượt chọn (votes)
  const sortedBreeds = [...dogBreeds].sort((a, b) => b.votes - a.votes);
  const router = useRouter();

  // Mảng các phần tử hiển thị trong FlatList
  const renderItems = [
    {
      type: "title",
      content: "Bảng Xếp Hạng Giống Chó",
    },
    {
      type: "subtitle",
      content: "Chọn giống chó yêu thích:",
    },
    {
      type: "dropdown",
      content: dogBreeds.map((item) => (
        <TouchableOpacity
          key={item.breed}
          style={[
            styles.dropdownItem,
            selectedBreed === item.breed && styles.selectedItem, // Highlight item được chọn
            item.votes === Math.max(...dogBreeds.map((breed) => breed.votes)) &&
              styles.highlightItem, // Highlight giống chó có điểm cao nhất
          ]}
          onPress={() => handleSelectBreed(item.breed)}
        >
          <Text style={styles.dropdownText}>{item.breed}</Text>
        </TouchableOpacity>
      )),
    },
    {
      type: "selectedBreed",
      content: selectedBreed ? `Giống chó bạn đã chọn: ${selectedBreed}` : "",
    },
    {
      type: "subtitle",
      content: "Bảng xếp hạng giống chó yêu thích:",
    },
    {
      type: "ranking",
      content: sortedBreeds.map((item, index) => (
        <View key={item.breed} style={styles.rankItem}>
          <Text style={styles.rankText}>
            {index + 1}. {item.breed} - {item.votes} lượt chọn
          </Text>
        </View>
      )),
    },
  ];

  return (
    <ScreenWrapper>
      <FlatList
        data={renderItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          if (item.type === "title") {
            return <Text style={styles.title}>{item.content}</Text>;
          }
          if (item.type === "subtitle") {
            return <Text style={styles.subtitle}>{item.content}</Text>;
          }
          if (item.type === "dropdown") {
            return <View style={styles.dropdown}>{item.content}</View>;
          }
          if (item.type === "selectedBreed") {
            return item.content ? (
              <Text style={styles.selectedBreed}>{item.content}</Text>
            ) : null;
          }
          if (item.type === "ranking") {
            return <>{item.content}</>;
          }
        }}
        ListHeaderComponent={<BackButton router={router} />}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4CAF50",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    padding: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedItem: {
    backgroundColor: "#d1e7dd", // Màu nền khi giống chó được chọn
  },
  highlightItem: {
    backgroundColor: "#ffeb3b", // Màu nền khi giống chó có điểm cao nhất
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  selectedBreed: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 20,
  },
  rankItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  rankText: {
    fontSize: 16,
    color: "#333",
  },
});

export default dogRanking;
