import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  isSubscribed: "zenpulse:isSubscribed",
} as const;

export async function getIsSubscribed(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.isSubscribed);
  return raw === "true";
}

export async function setIsSubscribed(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.isSubscribed, value ? "true" : "false");
}

