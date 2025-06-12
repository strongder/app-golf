"use client";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import MainTabs from "./component/MainTabs";
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
import { Provider, useDispatch } from "react-redux";
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
        name="Membership"
        component={MembershipScreen}
        options={{ title: "Đăng ký hội viên" }}
      />
    </Stack.Navigator>
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
      <Stack.Screen
        name="BookingHistory"
        component={BookingHistoryScreen}
        options={{ title: "Lịch sử đặt sân" }}
      />
      <Stack.Screen
        name="HistoryDetail"
        component={HistoryDetailScreen}
        options={{ title: "Chi tiết lịch sử" }}
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
import FloatingChatButton from "./screens/FloatingChatButton";
import EventsScreen from "./screens/EventScreen";
import { pushNotification } from "./redux/slices/NotificationSlice";

function AppWithSse() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  return (
    <>
      <AppNavigator />
      {user && (
        <>
          <SseNotificationListener
            userId={user.id}
            onNotification={(noti) => {
              dispatch(pushNotification(noti));
            }}
          />
          <FloatingChatButton />
        </>
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
