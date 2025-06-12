import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { View, Text } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ServicesScreen from "../screens/ServicesScreen";
import EventsScreen from "../screens/EventScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MembershipScreen from "../screens/MembershipScreen";
import ServiceDetailScreen from "../screens/ServiceDetailScreen";
import CourseDetailScreen from "../screens/CourseDetailScreen";
import BookingScreen from "../screens/BookingScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { getUnreadCount } from "@/redux/slices/NotificationSlice";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: "Sân Golf" }} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: "Chi tiết sân" }} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: "Đặt sân" }} />
    </Stack.Navigator>
  );
}

function ServicesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ServicesMain" component={ServicesScreen} options={{ title: "Dịch vụ" }} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} options={{ title: "Chi tiết dịch vụ", headerShown: true }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: "Cá nhân" }} />
      <Stack.Screen name="Membership" component={MembershipScreen} options={{ title: "Đăng ký hội viên" }} />
    </Stack.Navigator>
  );
}

const MainTabs = () => {
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((state: any) => state.notification);
  useEffect(() => {
    dispatch(getUnreadCount())
    }, [dispatch]);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Event") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Services") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else {
            iconName = "home-outline";
          }
          if (route.name === "Notifications" && unreadCount > 0) {
            return (
              <View>
                <Ionicons name={iconName} size={size} color={color} />
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -2,
                    backgroundColor: "#F44336",
                    borderRadius: 8,
                    minWidth: 16,
                    height: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 3,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              </View>
            );
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2E7D32",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: "Trang chủ" }} />
      <Tab.Screen name="Services" component={ServicesStack} options={{ title: "Dịch vụ" }} />
      <Tab.Screen name="Event" component={EventsScreen} options={{ title: "Sự kiên" }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ title: "Thông báo" }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ title: "Cá nhân" }} />
    </Tab.Navigator>
  );
};

export default MainTabs;
