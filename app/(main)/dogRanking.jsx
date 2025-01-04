import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";

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
    setSelectedBreed(breed);

    // Tăng lượt chọn cho giống chó
    setDogBreeds((prevBreeds) =>
      prevBreeds.map((item) =>
        item.breed === breed ? { ...item, votes: item.votes + 1 } : item
      )
    );
  };

  // Hàm sắp xếp giống chó theo số lượt chọn (votes)
  const sortedBreeds = [...dogBreeds].sort((a, b) => b.votes - a.votes);

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Bảng Xếp Hạng Giống Chó</Text>

        {/* Danh sách giống chó cho người dùng chọn */}
        <Text style={styles.subtitle}>Chọn giống chó yêu thích:</Text>
        <ScrollView style={styles.dropdown}>
          {dogBreeds.map((item) => (
            <TouchableOpacity
              key={item.breed}
              style={styles.dropdownItem}
              onPress={() => handleSelectBreed(item.breed)}
            >
              <Text style={styles.dropdownText}>{item.breed}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Hiển thị giống chó đã chọn */}
        {selectedBreed && (
          <Text style={styles.selectedBreed}>
            Giống chó bạn đã chọn: {selectedBreed}
          </Text>
        )}

        {/* Bảng xếp hạng */}
        <Text style={styles.subtitle}>Bảng xếp hạng giống chó yêu thích:</Text>
        <FlatList
          data={sortedBreeds}
          keyExtractor={(item) => item.breed}
          renderItem={({ item, index }) => (
            <View style={styles.rankItem}>
              <Text style={styles.rankText}>
                {index + 1}. {item.breed} - {item.votes} lượt chọn
              </Text>
            </View>
          )}
        />
      </ScrollView>
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
