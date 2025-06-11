import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import {
  createBooking,
  addBookingDetailToBooking,
} from "@/redux/slices/BookingSlice";
import { Picker } from "@react-native-picker/picker";
import { getAvailableTeeTimes, holdTeeTime } from "@/redux/slices/TeeTimeSlice";
import { use, useEffect, useState } from "react";
import ServiceDialog from "./ServiceDialog";
import { useAuth } from "@/contexts/AuthContext";
import { fetchGuestByUserId } from "@/redux/slices/GuestSlice";
import { fetchServicesTypeNot } from "@/redux/slices/ServiceSlice";

export default function BookingScreen({ route, navigation }: any) {
  const { course } = route.params || {};
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeId, setselectedTimeId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [players, setPlayers] = useState(1);
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [holes, setHoles] = useState(9);
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<{
    [key: string]: number;
  }>({});
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  // Lấy danh sách tee time khả dụng từ redux nếu có
  const { availableTeeTimes } = useSelector((state: any) => state.teeTime);
  const { serviceByBooking } = useSelector((state: any) => state.service);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };
  const { user } = useAuth();
  const { guestCurrent } = useSelector((state: any) => state.guest);

  // Thêm/xóa/cập nhật dịch vụ kèm theo cho booking
  const addOnService: any = (serviceId: string, quantity: number) => {
    const service = serviceByBooking.find((s: any) => s.id === serviceId);
    const maxQty = service?.maxQuantity || 10;
    if (quantity <= 0) {
      const newServices = { ...selectedServices };
      delete newServices[serviceId];
      setSelectedServices(newServices);
    } else if (quantity <= maxQty) {
      setSelectedServices({
        ...selectedServices,
        [serviceId]: quantity,
      });
    }
  };
  // Tính tiền sân
  const totalCoursePrice = (selectedSlot?.price && players) ? selectedSlot.price * players : 0;

  // Tính tổng tiền dịch vụ kèm theo
  const totalServicePrice = Object.entries(selectedServices).reduce((sum, [serviceId, quantity]) => {
    const service = serviceByBooking.find((s: any) => s.id === serviceId);
    if (service && service.price && quantity > 0) {
      return sum + service.price * quantity;
    }
    return sum;
  }, 0);

  // Tổng cộng
  const totalPrice = totalCoursePrice + totalServicePrice;



  const handleBooking = async () => {
    if (!course) {
      Alert.alert("Lỗi", "Vui lòng chọn sân golf");
      return;
    }
    if (!selectedTimeId) {
      Alert.alert("Lỗi", "Vui lòng chọn giờ chơi");
      return;
    }
    // No tool selection required anymore
    setLoading(true);
    try {
      const bookingRequest = {
        golfCourseId: course.id,
        userId: user?.id || "",
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        bookingDate: selectedDate.toISOString().split("T")[0],
        teeTimeId: selectedTimeId,
        guestId: guestCurrent?.id || "",
        numberPlayers: players,
        numberOfHoles: holes,
        note: notes,

      };
      console.log("Booking Request:", bookingRequest);
      // 1. Tạo booking trước
      const result = await dispatch(
        createBooking(bookingRequest) as any
      ).unwrap();

      // 2. Nếu có dịch vụ kèm theo, gọi addBookingDetailToBooking
      const bookingId = result?.id;
      const bookingDetails = Object.entries(selectedServices).map(
        ([serviceId, quantity]) => {
          const service = serviceByBooking.find((s: any) => s.id === serviceId);
          return {
            serviceId,
            quantity,
            totalPrice: (service?.price || 0) * quantity,
          };
        }
      );
      if (bookingId && bookingDetails.length > 0) {
        await dispatch(
          addBookingDetailToBooking({
            bookingId,
            details: bookingDetails,
          }) as any
        );
      }

      Alert.alert(
        "Đặt sân thành công!",
        `Bạn đã đặt sân ${course.name} vào ${selectedDate?.toLocaleDateString(
          "vi-VN"
        )} lúc ${selectedTimeId}`,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("BookingHistory"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Lỗi", error?.message || "Có lỗi xảy ra khi đặt sân");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceQuantityChange = (serviceId: string, quantity: number) => {
    addOnService(serviceId, quantity);
  };
  // Nếu slot đã hold không còn khả dụng sau khi getAvailableTeeTimes, chỉ cảnh báo khi slot đó bị người khác đặt (không phải chỉ mất khỏi available do chính mình hold)
  useEffect(() => {
    if (selectedTimeId && availableTeeTimes.length > 0) {
      const stillAvailable = availableTeeTimes.some(
        (t: any) => t.id === selectedTimeId
      );
      if (!stillAvailable) {
      }
    }
  }, [availableTeeTimes]);

  // Danh sách giờ chơi hiển thị: luôn bao gồm slot đang hold nếu đã chọn, kể cả không còn trong availableTeeTimes
  const mergedTeeTimes = selectedTimeId
    ? [
        ...availableTeeTimes,
        ...(!availableTeeTimes.some((t: any) => t.id === selectedTimeId) &&
        selectedSlot
          ? [selectedSlot]
          : []),
      ]
    : availableTeeTimes;
  
  

  // Gọi tee time available mỗi 30s
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    function fetchTeeTimes() {
      if (selectedDate) {
        console.log("1");
        dispatch(
          getAvailableTeeTimes({
            golfCourseId: course.id,
            date: selectedDate.toISOString().split("T")[0],
          })
        );
      }
    }
    fetchTeeTimes(); // gọi lần đầu
    interval = setInterval(fetchTeeTimes, 15000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedDate, course.id, dispatch]);

  useEffect(() => {
    if (selectedTimeId && holes) {
      dispatch(
        holdTeeTime({
          teeTimeId: selectedTimeId,
          holes: holes,
        })
      );
    }
  }, [selectedTimeId, holes]);

  useEffect(() => {
    if (user) {
      // Lấy danh sách tee time khả dụng cho sân và ngày đã chọn
      dispatch(fetchGuestByUserId(user.id));
    }
  }, [dispatch]);

  const handelOpenServiceDialog = () => {
    dispatch(fetchServicesTypeNot("OTHER"));
    setShowServiceDialog(true);
  };

  if (!course) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Đặt sân</Text>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate("BookingHistory")}
          >
            <Ionicons name="time-outline" size={24} color="#2E7D32" />
            <Text style={styles.historyText}>Lịch sử</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="golf-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Chọn sân golf để đặt lịch</Text>
        </View>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đặt sân</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate("BookingHistory")}
        >
          <Ionicons name="time-outline" size={24} color="#2E7D32" />
          <Text style={styles.historyText}>Lịch sử</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.courseInfo}>
          <Text style={styles.courseName}>{course.name}</Text>
          <Text style={styles.courseLocation}>{course.location}</Text>
          <Text style={styles.coursePrice}>
            {course.price?.toLocaleString("vi-VN")} VNĐ/vòng
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn ngày</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#2E7D32" />
            <Text style={styles.dateText}>
              {selectedDate?.toLocaleDateString("vi-VN")}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>
        {/* Số hố chơi & Chọn giờ cùng hàng */}
        <View
          style={[
            styles.section,
            { flexDirection: "row", alignItems: "flex-end", gap: 12 },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.sectionTitle, { fontSize: 16, marginBottom: 8 }]}
            >
              Chọn số hố
            </Text>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#2E7D32",
                marginBottom: 0,
                overflow: "hidden",
                paddingHorizontal: 4,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Picker
                selectedValue={holes}
                onValueChange={(itemValue) => setHoles(itemValue)}
                style={{
                  height: Platform.OS === "ios" ? 60 : 60,
                  width: 100,
                  fontSize: 18,
                  color: "#222",
                }}
                itemStyle={{ fontSize: 18, color: "#222", height: 44 }}
                mode="dropdown"
              >
                <Picker.Item label="9 hố" value={9} />
                <Picker.Item label="18 hố" value={18} />
              </Picker>
            </View>
          </View>
          <View style={{ flex: 2, marginLeft: 8 }}>
            <Text
              style={[styles.sectionTitle, { fontSize: 16, marginBottom: 8 }]}
            >
              Chọn giờ
            </Text>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#2E7D32",
                marginBottom: 0,
                overflow: "hidden",
                paddingHorizontal: 8,
                paddingVertical: Platform.OS === "ios" ? 8 : 0,
              }}
            >
              <Picker
                selectedValue={selectedTimeId}
                onValueChange={(itemValue) => {
                  setselectedTimeId(itemValue);
                  // Lưu lại object slot đầy đủ khi chọn
                  const slotObj = availableTeeTimes.find(
                    (t: any) => t.id === itemValue
                  );
                  setSelectedSlot(slotObj || null);
                }}
                style={{
                  height: Platform.OS === "ios" ? 60 : 60,
                  width: "100%",
                  fontSize: 18,
                  color: "#222",
                }}
                itemStyle={{ fontSize: 18, color: "#222", height: 44 }}
                mode="dropdown"
              >
                <Picker.Item label="Chọn giờ chơi" value="" />
                {mergedTeeTimes.map((time: any) => (
                  <Picker.Item
                    key={time.id}
                    label={time.startTime}
                    value={time.id}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.section,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              marginBottom: 10,
            },
          ]}
        >
          <Text
            style={[styles.sectionTitle, { marginBottom: 0, marginRight: 16 }]}
          >
            Số người:
          </Text>
          <TouchableOpacity
            style={[
              styles.playerButton,
              { width: 32, height: 32, borderRadius: 16 },
            ]}
            onPress={() => setPlayers(Math.max(1, players - 1))}
          >
            <Ionicons name="remove" size={18} color="#2E7D32" />
          </TouchableOpacity>
          <Text
            style={[
              styles.playersText,
              {
                fontSize: 16,
                marginHorizontal: 16,
                minWidth: 24,
                marginBottom: 0,
              },
            ]}
          >
            {players}
          </Text>
          <TouchableOpacity
            style={[
              styles.playerButton,
              { width: 32, height: 32, borderRadius: 16 },
            ]}
            onPress={() => setPlayers(Math.min(4, players + 1))}
          >
            <Ionicons name="add" size={18} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Nhập ghi chú (tùy chọn)"
            multiline
            numberOfLines={3}
          />
        </View>
        {/* Add-on Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dịch vụ kèm theo</Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#e8f5e9",
              borderRadius: 8,
              padding: 12,
              alignItems: "center",
              marginBottom: 10,
            }}
            onPress={handelOpenServiceDialog}
          >
            <Text
              style={{ color: "#2E7D32", fontWeight: "bold", fontSize: 15 }}
            >
              Chọn dịch vụ
            </Text>
          </TouchableOpacity>
          {/* Hiển thị các dịch vụ đã chọn */}
          {Object.entries(selectedServices)
            .filter(([_, qty]) => qty > 0)
            .map(([serviceId, quantity]) => {
              const service = serviceByBooking.find(
                (s: any) => s.id === serviceId
              );
              if (!service) return null;
              return (
                <View key={serviceId} style={styles.serviceCard}>
                  <View style={styles.serviceInfo}>
                    <View style={styles.serviceHeader}>
                      <Ionicons
                        name={service.icon as any}
                        size={24}
                        color="#2E7D32"
                      />
                      <View style={styles.serviceDetails}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <Text style={styles.serviceDescription}>
                          {service.description}
                        </Text>
                        <Text style={styles.servicePrice}>
                          {service.price?.toLocaleString("vi-VN")} VNĐ x{" "}
                          {quantity}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>

        {/* Dialog chọn dịch vụ */}
        <ServiceDialog
          visible={showServiceDialog}
          onClose={() => setShowServiceDialog(false)}
          addOnServices={serviceByBooking}
          selectedServices={selectedServices}
          onServiceChange={handleServiceQuantityChange}
          players={players}
        />
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Tóm tắt đặt sân</Text>

          {/* Course booking */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sân golf:</Text>
            <Text style={styles.summaryValue}>{course?.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ngày giờ:</Text>
            <Text style={styles.summaryValue}>
              {selectedDate?.toLocaleDateString("vi-VN")} -{" "}
              {selectedSlot?.startTime + " giờ" || "Chưa chọn"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số người:</Text>
            <Text style={styles.summaryValue}>{players}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tiền sân:</Text>
            <Text style={styles.summaryValue}>
              {(totalCoursePrice)?.toLocaleString("vi-VN")} VNĐ
            </Text>
          </View>

          {/* Add-on services summary */}
          {Object.entries(selectedServices).length > 0 && (
            <>
              <View style={styles.summaryDivider} />
              <Text style={styles.summarySubtitle}>Dịch vụ kèm theo:</Text>
              {Object.entries(selectedServices).map(([serviceId, quantity]) => {
                const service = serviceByBooking.find(
                  (s: any) => s.id === serviceId
                );
                if (!service) return null;

                return (
                  <View key={serviceId} style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                      {service.name} x{quantity}:
                    </Text>
                    <Text style={styles.summaryValue}>
                      {(service.price * quantity)?.toLocaleString("vi-VN")} VNĐ
                    </Text>
                  </View>
                );
              })}
            </>
          )}

          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Tổng cộng:</Text>
            <Text style={styles.summaryTotal}>
              {totalPrice.toLocaleString("vi-VN")} VNĐ
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookButton, loading && styles.bookButtonDisabled]}
          onPress={handleBooking}
          disabled={loading}
        >
          <Text style={styles.bookButtonText}>
            {loading ? "Đang đặt sân..." : "Xác nhận đặt sân"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyText: {
    marginLeft: 5,
    color: "#2E7D32",
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  courseInfo: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  courseLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeSlot: {
    width: "23%",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedTimeIdSlot: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  timeText: {
    fontSize: 14,
    color: "#333",
  },
  selectedTimeIdText: {
    color: "white",
  },
  playersContainer: {
    flexDirection: "row",
    alignItems: "center",
    // Removed background, shadow, and padding for compact look
  },
  playerButton: {
    backgroundColor: "#f0f0f0",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  playersText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 16,
    color: "#333",
    minWidth: 24,
    marginBottom: 0,
  },
  notesInput: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    textAlignVertical: "top",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  serviceCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceHeader: {
    flexDirection: "row",
    flex: 1,
  },
  serviceDetails: {
    marginLeft: 12,
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  serviceControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 15,
    minWidth: 20,
    textAlign: "center",
    color: "#333",
  },
  summary: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  summarySubtitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  bookButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  bookButtonDisabled: {
    backgroundColor: "#ccc",
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
});
