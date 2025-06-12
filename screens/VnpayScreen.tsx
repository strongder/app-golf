import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import WebView from "react-native-webview";

const VnpayScreen = ({ route, navigation }: any) => {
  const { paymentUrl } = route.params;
  const [loading, setLoading] = useState(true);

  const handleNavigationStateChange = (navState: any) => {
    console.log("Navigation State:", navState);

    if (navState.url.includes("vnpay-return")) {
      const urlParams = new URLSearchParams(navState.url.split("?")[1]);
      const status = urlParams.get("status");
      navigation.navigate("PaymentResult", { isSuccess: status });
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <WebView
        source={{ uri: paymentUrl }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("HTTP Error: ", nativeEvent);
        }}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
});

export default VnpayScreen;
