"use client";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import BookingScreen from "./screens/BookingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CourseDetailScreen from "./screens/CourseDetailScreen";
import BookingHistoryScreen from "./screens/BookingHistoryScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import HistoryDetailScreen from "./screens/HistoryDetailScreen";
// Thêm import cho các màn hình mới
import MembershipScreen from "./screens/MembershipScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import ServicesScreen from "./screens/ServicesScreen";
import ServiceDetailScreen from "./screens/ServiceDetailScreen";
import { store } from "./redux/store"; // Giả sử bạn đã cấu hình Redux store
import { Provider } from "react-redux";
import VnpayScreen from "./screens/VnpayScreen";
import PaymentResultScreen from "./screens/PaymentResult";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: "Sân Golf" }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{ title: "Chi tiết sân" }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ title: "Đặt sân" }}
      />
    </Stack.Navigator>
  );
}

function ServicesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ServicesMain"
        component={ServicesScreen}
        options={{ title: "Dịch vụ" }}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ title: "Chi tiết dịch vụ", headerShown: true }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: "Cá nhân" }}
      />
      <Stack.Screen
        name="BookingHistory"
        component={BookingHistoryScreen}
        options={{ title: "Lịch sử đặt sân" }}
      />
      <Stack.Screen
        name="Membership"
        component={MembershipScreen}
        options={{ title: "Đăng ký hội viên" }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Thông báo" }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Booking") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Services") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "home-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2E7D32",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: "Trang chủ" }}
      />

      <Tab.Screen
        name="Services"
        component={ServicesStack}
        options={{ title: "Dịch vụ" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: "Cá nhân" }}
      />
    
    </Tab.Navigator>
  );
}
function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={MainTabs} />
      <RootStack.Screen
        name="VnpayScreen"
        component={VnpayScreen}
        options={{ title: "Thanh toán VNPAY", headerShown: true }}
      />
      <RootStack.Screen
        name="PaymentResult"
        component={PaymentResultScreen}
        options={{ title: "Kết quả thanh toán", headerShown: true }}
      />
    </RootStack.Navigator>
  );
}
function AppNavigator() {
  const { user, loading, isFirstTime } = useAuth();

  if (loading) {
    return null; // Or loading screen
  }

  if (isFirstTime) {
    return <OnboardingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <RootNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
}

import SseNotificationListener from "./component/SseNotificationListener";

function AppWithSse() {
  const { user } = useAuth();
  return (
    <>
      <AppNavigator />
      {user && (
        <SseNotificationListener
          userId={user.id}
          onNotification={(noti) => {
            // Handle notification here
            console.log("Received notification:", noti);
          }}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <StatusBar style="auto" />
        <AppWithSse />
      </AuthProvider>
    </Provider>
  );
}
