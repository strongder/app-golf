"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../contexts/AuthContext"

const { width, height } = Dimensions.get("window")

interface OnboardingItem {
  id: string
  title: string
  description: string
  image: string
  icon: keyof typeof Ionicons.glyphMap
}

const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    title: "Chào mừng đến với Golf Booking",
    description:
      "Ứng dụng đặt sân golf hàng đầu Việt Nam. Tìm kiếm và đặt sân golf yêu thích của bạn một cách dễ dàng.",
    image: "/placeholder.svg?height=300&width=300",
    icon: "golf-outline",
  },
  {
    id: "2",
    title: "Tìm kiếm sân golf",
    description:
      "Khám phá hàng trăm sân golf chất lượng cao trên khắp cả nước với thông tin chi tiết và hình ảnh thực tế.",
    image: "/placeholder.svg?height=300&width=300",
    icon: "search-outline",
  },
  {
    id: "3",
    title: "Đặt sân dễ dàng",
    description: "Chọn ngày, giờ và số người chơi. Xác nhận đặt sân chỉ trong vài bước đơn giản.",
    image: "/placeholder.svg?height=300&width=300",
    icon: "calendar-outline",
  },
  {
    id: "4",
    title: "Quản lý lịch trình",
    description: "Theo dõi lịch sử đặt sân, quản lý các booking và nhận thông báo quan trọng.",
    image: "/placeholder.svg?height=300&width=300",
    icon: "time-outline",
  },
]

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const scrollX = useRef(new Animated.Value(0)).current
  const { completeOnboarding } = useAuth()

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1
      flatListRef.current?.scrollToIndex({ index: nextIndex })
      setCurrentIndex(nextIndex)
    } else {
      completeOnboarding()
    }
  }

  const handleSkip = () => {
    completeOnboarding()
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      flatListRef.current?.scrollToIndex({ index: prevIndex })
      setCurrentIndex(prevIndex)
    }
  }

  const renderOnboardingItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <View style={styles.iconBackground}>
          <Ionicons name={item.icon} size={80} color="#2E7D32" />
        </View>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  )

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingData.map((_, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width]
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        })
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        })

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity,
              },
            ]}
          />
        )
      })}
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Bỏ qua</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderOnboardingItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width)
          setCurrentIndex(index)
        }}
      />

      {renderPagination()}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navigationButton, currentIndex === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? "#ccc" : "#2E7D32"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1 ? "Bắt đầu" : "Tiếp theo"}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    color: "#666",
  },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#E8F5E8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
    position: "absolute",
    opacity: 0.1,
  },
  textContainer: {
    flex: 0.4,
    alignItems: "center",
    paddingBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2E7D32",
    marginHorizontal: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  navigationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#f8f8f8",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
})
