import { Linking } from "react-native";

export function callHotline() {
  const phone: string = "19001234";
  Linking.openURL(`tel:${phone}`);
}
