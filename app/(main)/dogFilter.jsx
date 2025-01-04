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

const DogBreedFilter = () => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedTemperament, setSelectedTemperament] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [filteredBreeds, setFilteredBreeds] = useState(dogBreeds);

  const dogBreeds = [
    {
      breed: "Golden Retriever",
      size: "Large",
      color: "Golden",
      age: "Adult",
      temperament: "Friendly",
      activity: "Running",
    },
    {
      breed: "Poodle",
      size: "Medium",
      color: "White",
      age: "Puppy",
      temperament: "Calm",
      activity: "Swimming",
    },
    {
      breed: "German Shepherd",
      size: "Large",
      color: "Black",
      age: "Adult",
      temperament: "Aggressive",
      activity: "Hunting",
    },
    {
      breed: "Bulldog",
      size: "Medium",
      color: "Brown",
      age: "Senior",
      temperament: "Friendly",
      activity: "Sleeping",
    },
    {
      breed: "Beagle",
      size: "Small",
      color: "Tri-color",
      age: "Puppy",
      temperament: "Playful",
      activity: "Running",
    },
    {
      breed: "Husky",
      size: "Large",
      color: "Gray",
      age: "Adult",
      temperament: "Friendly",
      activity: "Running",
    },
    {
      breed: "Chihuahua",
      size: "Small",
      color: "Tan",
      age: "Senior",
      temperament: "Calm",
      activity: "Sleeping",
    },
    {
      breed: "Dachshund",
      size: "Small",
      color: "Brown",
      age: "Adult",
      temperament: "Playful",
      activity: "Running",
    },
    {
      breed: "Shiba Inu",
      size: "Medium",
      color: "Red",
      age: "Puppy",
      temperament: "Aggressive",
      activity: "Hunting",
    },
    {
      breed: "Corgi",
      size: "Medium",
      color: "Tri-color",
      age: "Adult",
      temperament: "Friendly",
      activity: "Running",
    },
  ];

  // Hàm lọc giống chó theo các đặc điểm được chọn
  const filterBreeds = () => {
    let result = dogBreeds;

    if (selectedSize) {
      result = result.filter((breed) => breed.size === selectedSize);
    }
    if (selectedColor) {
      result = result.filter((breed) => breed.color === selectedColor);
    }
    if (selectedAge) {
      result = result.filter((breed) => breed.age === selectedAge);
    }
    if (selectedTemperament) {
      result = result.filter(
        (breed) => breed.temperament === selectedTemperament
      );
    }
    if (selectedActivity) {
      result = result.filter((breed) => breed.activity === selectedActivity);
    }

    setFilteredBreeds(result);
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Lọc Giống Chó Theo Đặc Điểm</Text>

        {/* Chọn kích thước chó */}
        <Text style={styles.subtitle}>Chọn Kích Thước:</Text>
        <View style={styles.filterContainer}>
          {["Small", "Medium", "Large"].map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.filterButton,
                selectedSize === size && styles.selectedButton,
              ]}
              onPress={() => {
                setSelectedSize(size);
                filterBreeds();
              }}
            >
              <Text style={styles.buttonText}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chọn màu sắc chó */}
        <Text style={styles.subtitle}>Chọn Màu Sắc:</Text>
        <View style={styles.filterContainer}>
          {[
            "Golden",
            "White",
            "Black",
            "Brown",
            "Tri-color",
            "Gray",
            "Tan",
            "Red",
          ].map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.filterButton,
                selectedColor === color && styles.selectedButton,
              ]}
              onPress={() => {
                setSelectedColor(color);
                filterBreeds();
              }}
            >
              <Text style={styles.buttonText}>{color}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chọn độ tuổi */}
        <Text style={styles.subtitle}>Chọn Độ Tuổi:</Text>
        <View style={styles.filterContainer}>
          {["Puppy", "Adult", "Senior"].map((age) => (
            <TouchableOpacity
              key={age}
              style={[
                styles.filterButton,
                selectedAge === age && styles.selectedButton,
              ]}
              onPress={() => {
                setSelectedAge(age);
                filterBreeds();
              }}
            >
              <Text style={styles.buttonText}>{age}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chọn tính cách */}
        <Text style={styles.subtitle}>Chọn Tính Cách:</Text>
        <View style={styles.filterContainer}>
          {["Friendly", "Aggressive", "Calm", "Playful"].map((temperament) => (
            <TouchableOpacity
              key={temperament}
              style={[
                styles.filterButton,
                selectedTemperament === temperament && styles.selectedButton,
              ]}
              onPress={() => {
                setSelectedTemperament(temperament);
                filterBreeds();
              }}
            >
              <Text style={styles.buttonText}>{temperament}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chọn hoạt động yêu thích */}
        <Text style={styles.subtitle}>Chọn Hoạt Động Yêu Thích:</Text>
        <View style={styles.filterContainer}>
          {["Running", "Swimming", "Hunting", "Sleeping"].map((activity) => (
            <TouchableOpacity
              key={activity}
              style={[
                styles.filterButton,
                selectedActivity === activity && styles.selectedButton,
              ]}
              onPress={() => {
                setSelectedActivity(activity);
                filterBreeds();
              }}
            >
              <Text style={styles.buttonText}>{activity}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hiển thị danh sách giống chó đã lọc */}
        <Text style={styles.subtitle}>Danh Sách Giống Chó:</Text>
        <FlatList
          data={filteredBreeds}
          keyExtractor={(item) => item.breed}
          renderItem={({ item, index }) => (
            <View style={styles.rankItem}>
              <Text style={styles.rankText}>
                {index + 1}. {item.breed} - Kích thước: {item.size} - Màu sắc:{" "}
                {item.color} - Tuổi: {item.age} - Tính cách: {item.temperament}{" "}
                - Hoạt động: {item.activity}
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
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
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

export default DogBreedFilter;
