import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper"; // Giả sử bạn có một ScreenWrapper component
import { useRouter } from "expo-router";
import BackButton from "../../components/BackButton";

const AppointmentManager = () => {
  const [dogList] = useState([
    { id: "1", name: "Golden Retriever" },
    { id: "2", name: "Poodle" },
    { id: "3", name: "German Shepherd" },
    { id: "4", name: "Bulldog" },
  ]);

  const [appointments, setAppointments] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");

  // Thêm lịch hẹn
  const addAppointment = () => {
    if (!selectedDog || !appointmentDate) {
      Alert.alert("Vui lòng chọn chú chó và ngày khám.");
      return;
    }

    setAppointments((prevAppointments) => [
      ...prevAppointments,
      {
        id: Date.now().toString(),
        dog: selectedDog,
        date: appointmentDate,
        completed: false,
      },
    ]);
    setSelectedDog(null);
    setAppointmentDate("");
  };

  // Xóa lịch hẹn
  const cancelAppointment = (appointmentId) => {
    setAppointments((prevAppointments) =>
      prevAppointments.filter((appointment) => appointment.id !== appointmentId)
    );
  };

  // Đánh dấu lịch hẹn là đã xong
  const completeAppointment = (appointmentId) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, completed: true }
          : appointment
      )
    );
  };
  const router = useRouter();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton router={router} />
        <Text style={styles.title}>Quản Lý Lịch Hẹn Khám Cho Chó</Text>

        {/* Chọn chó */}
        <Text style={styles.subtitle}>Chọn chú chó của bạn</Text>
        <FlatList
          data={dogList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dogItem}
              onPress={() => setSelectedDog(item.name)}
            >
              <Text style={styles.dogText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />

        {/* Hiển thị chó đã chọn */}
        {selectedDog && (
          <Text style={styles.selectedDog}>Chú chó đã chọn: {selectedDog}</Text>
        )}

        {/* Nhập ngày khám */}
        <Text style={styles.subtitle}>Chọn ngày khám (dd/mm/yyyy):</Text>
        <TextInput
          style={styles.input}
          value={appointmentDate}
          onChangeText={setAppointmentDate}
          placeholder="Ngày khám"
        />

        {/* Các nút hành động */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={addAppointment}>
            <Text style={styles.buttonText}>Đã Xong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              setSelectedDog(null);
              setAppointmentDate("");
            }}
          >
            <Text style={styles.buttonText}>Hủy Bỏ</Text>
          </TouchableOpacity>
        </View>

        {/* Lịch hẹn đã hoàn thành */}
        <Text style={styles.subtitle}>Lịch Hẹn Đã Hoàn Thành:</Text>
        <FlatList
          data={appointments.filter((appointment) => appointment.completed)}
          renderItem={({ item }) => (
            <View style={styles.appointmentItem}>
              <Text style={styles.appointmentText}>
                {item.dog} - {item.date}{" "}
                <Text style={styles.completed}>✔️</Text>
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />

        {/* Lịch hẹn chưa hoàn thành */}
        <Text style={styles.subtitle}>Lịch Hẹn Chưa Hoàn Thành:</Text>
        <FlatList
          data={appointments.filter((appointment) => !appointment.completed)}
          renderItem={({ item }) => (
            <View style={styles.appointmentItem}>
              <Text style={styles.appointmentText}>
                {item.dog} - {item.date}
              </Text>
              <View style={styles.appointmentActions}>
                <TouchableOpacity
                  style={[styles.button, styles.completeButton]}
                  onPress={() => completeAppointment(item.id)}
                >
                  <Text style={styles.buttonText}>Đã Xong</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => cancelAppointment(item.id)}
                >
                  <Text style={styles.buttonText}>Đã hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  dogItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dogText: {
    fontSize: 16,
    color: "#333",
  },
  selectedDog: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#4CAF50",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  appointmentItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  appointmentText: {
    fontSize: 16,
    color: "#333",
  },
  completed: {
    color: "#4CAF50",
  },
  appointmentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  completeButton: {
    backgroundColor: "#4CAF50",
  },
});

export default AppointmentManager;
