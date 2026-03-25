import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "../components/AppButton";
import { getIsSubscribed, setIsSubscribed } from "../lib/storage";

export default function PaywallScreen() {
  const onSubscribe = async () => {
    await setIsSubscribed(true);
  };

  const onReset = async () => {
    await setIsSubscribed(false);
  };

  const onCheck = async () => {
    const value = await getIsSubscribed();
    // For prototype: keep UI minimal; value can be inspected via logs/dev tools later.
    void value;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Подписка</Text>
        <Text style={styles.subtitle}>
          Разблокируй все медитации, новые практики и офлайн-доступ.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ZenPulse Plus</Text>
          <Text style={styles.cardText}>- Полная библиотека</Text>
          <Text style={styles.cardText}>- Еженедельные новые практики</Text>
          <Text style={styles.cardText}>- Офлайн-режим</Text>
        </View>

        <View style={styles.actions}>
          <AppButton title="Активировать подписку" onPress={onSubscribe} />
          <AppButton
            title="Сбросить подписку"
            variant="secondary"
            onPress={onReset}
          />
          <AppButton
            title="Проверить статус (dev)"
            variant="secondary"
            onPress={onCheck}
          />
          <AppButton title="Назад" variant="ghost" onPress={() => router.back()} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0B1220" },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  title: { color: "#EAF0FF", fontSize: 24, fontWeight: "800" },
  subtitle: { color: "#AEB9D6", fontSize: 14, lineHeight: 20 },
  card: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 16,
    gap: 8,
  },
  cardTitle: { color: "#EAF0FF", fontSize: 16, fontWeight: "800" },
  cardText: { color: "#C9D3F0", fontSize: 14, lineHeight: 20 },
  actions: { gap: 10, paddingTop: 4 },
});

