import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Sử dụng thư viện icons, bạn có thể cài đặt với `expo install @expo/vector-icons`

const PaymentResultScreen = ({ navigation, route }: any) => {
  const { isSuccess } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {isSuccess === "COMPLETED" ? (
          <View style={styles.resultContainer}>
            <Ionicons name="checkmark-circle" size={100} color="#28a745" />
            <Text style={styles.successText}>Thanh toán thành công!</Text>
            <Text style={styles.subText}>
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
            </Text>
          </View>
        ) : (
          <View style={styles.resultContainer}>
            <Ionicons name="close-circle" size={100} color="#dc3545" />
            <Text style={styles.subText}>
              Vui lòng kiểm tra lại thông tin và thử lại.
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Home", {
              screen: "HomeScreen",
            })
          }
        >
          <Text style={styles.buttonText}>Quay lại trang chủ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    width: "90%",
  },
  resultContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  successText: {
    fontSize: 24,
    color: "#28a745",
    fontWeight: "bold",
    marginTop: 10,
  },
  failureText: {
    fontSize: 24,
    color: "#dc3545",
    fontWeight: "bold",
    marginTop: 10,
  },
  subText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PaymentResultScreen;
