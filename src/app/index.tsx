import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "../components/AppButton";

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Text style={styles.title}>ZenPulse</Text>
        <Text style={styles.subtitle}>Медитации</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Сегодня</Text>
          <Text style={styles.cardText}>
            Короткая практика дыхания, чтобы успокоиться и сфокусироваться.
          </Text>
        </View>

        <AppButton
          title="Открыть подписку"
          onPress={() => router.push("/paywall")}
        />
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
  title: {
    color: "#EAF0FF",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  subtitle: { color: "#AEB9D6", fontSize: 16, fontWeight: "600" },
  card: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 16,
    gap: 8,
  },
  cardTitle: { color: "#EAF0FF", fontSize: 16, fontWeight: "700" },
  cardText: { color: "#C9D3F0", fontSize: 14, lineHeight: 20 },
});
