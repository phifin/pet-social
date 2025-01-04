import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import petBook from "../../assets/petBook.json"; // Import file JSON
import BackButton from "../../components/BackButton";
import { useRouter } from "expo-router";

export default function App() {
  const [searchText, setSearchText] = useState(""); // Quản lý giá trị trong thanh tìm kiếm
  const [searchResult, setSearchResult] = useState(null); // Lưu kết quả tìm kiếm
  const [selectedBreed, setSelectedBreed] = useState(null); // Quản lý giống chó được chọn
  const router = useRouter();

  // Hàm tìm kiếm giống chó
  const handleSearch = () => {
    const result = petBook.pet_handbook.find(
      (item) => item.breed.toLowerCase() === searchText.trim().toLowerCase() // So sánh tên giống chó
    );
    setSearchResult(result);
    setSelectedBreed(null); // Reset lựa chọn dropdown nếu tìm kiếm được
  };

  // Hàm render danh sách dropdown
  const renderDropdown = () => (
    <ScrollView style={styles.dropdown}>
      {petBook.pet_handbook.map((item) => (
        <TouchableOpacity
          key={item.breed}
          style={styles.dropdownItem}
          onPress={() => {
            setSelectedBreed(item);
            setSearchResult(null); // Reset kết quả tìm kiếm nếu chọn từ dropdown
          }}
        >
          <Text style={styles.dropdownText}>{item.breed}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <ScrollView style={styles.container}>
      <BackButton router={router} />
      <Text style={styles.title}>Cẩm Nang Thú Cưng</Text>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập tên giống chó..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị kết quả tìm kiếm */}
      {searchResult ? (
        <ScrollView style={styles.infoBox}>
          <Text style={styles.breedName}>{searchResult.breed}</Text>
          <Text style={styles.infoTitle}>Phối giống:</Text>
          <Text style={styles.infoText}>{searchResult.breeding}</Text>
          <Text style={styles.infoTitle}>Chế độ ăn uống:</Text>
          <Text style={styles.infoText}>{searchResult.diet}</Text>
          <Text style={styles.infoTitle}>Thói quen sinh hoạt:</Text>
          <Text style={styles.infoText}>{searchResult.habits}</Text>
        </ScrollView>
      ) : selectedBreed ? (
        <ScrollView style={styles.infoBox}>
          <Text style={styles.breedName}>{selectedBreed.breed}</Text>
          <Text style={styles.infoTitle}>Phối giống:</Text>
          <Text style={styles.infoText}>{selectedBreed.breeding}</Text>
          <Text style={styles.infoTitle}>Chế độ ăn uống:</Text>
          <Text style={styles.infoText}>{selectedBreed.diet}</Text>
          <Text style={styles.infoTitle}>Thói quen sinh hoạt:</Text>
          <Text style={styles.infoText}>{selectedBreed.habits}</Text>
        </ScrollView>
      ) : (
        <Text style={styles.noSelection}>
          Hãy chọn một giống chó hoặc tìm kiếm để xem thông tin.
        </Text>
      )}

      {/* Dropdown Menu */}
      <Text style={styles.subtitle}>Chọn giống chó từ danh sách</Text>
      {renderDropdown()}
    </ScrollView>
  );
}

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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  dropdown: {
    maxHeight: 300,
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
  infoBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  breedName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2196F3",
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  noSelection: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});
