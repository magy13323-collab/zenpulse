import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "../components/AppButton";
import { setIsSubscribed } from "../lib/storage";

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "yearly",
  );

  const priceLabel = useMemo(() => {
    if (selectedPlan === "yearly") return "1 990 ₽ / год";
    return "299 ₽ / месяц";
  }, [selectedPlan]);

  const secondaryLabel = useMemo(() => {
    if (selectedPlan === "yearly") return "Экономия ~45% по сравнению с Monthly";
    return "Отмена в любой момент";
  }, [selectedPlan]);

  const onTryFree = async () => {
    await setIsSubscribed(true);
    router.replace("/");
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#070A14", "#0B1220", "#0A1630"]}
        start={{ x: 0.1, y: 0.0 }}
        end={{ x: 0.9, y: 1.0 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.kicker}>Премиум доступ</Text>
            <Text style={styles.title}>ZenPulse Premium</Text>
            <Text style={styles.subtitle}>
              Спокойствие, фокус и сон — с лучшими практиками без ограничений.
            </Text>
          </View>

          <View style={styles.benefitsCard}>
            <Text style={styles.sectionTitle}>Что внутри</Text>
            <View style={styles.benefitsList}>
              <Benefit text="Полная библиотека медитаций и дыхательных практик" />
              <Benefit text="Еженедельные новые сессии и подборки" />
              <Benefit text="Офлайн-доступ для поездок и перелётов" />
              <Benefit text="Без отвлекающих ограничений — только практика" />
            </View>
          </View>

          <View style={styles.plans}>
            <Text style={styles.sectionTitle}>Выбери тариф</Text>

            <PlanCard
              title="Monthly"
              price="299 ₽"
              period="в месяц"
              helper="Гибко: можно отменить в любой момент"
              selected={selectedPlan === "monthly"}
              onPress={() => setSelectedPlan("monthly")}
            />

            <PlanCard
              title="Yearly"
              price="1 990 ₽"
              period="в год"
              helper="Best Value — выгоднее и спокойнее"
              badge="Best Value"
              selected={selectedPlan === "yearly"}
              onPress={() => setSelectedPlan("yearly")}
              emphasize
            />
          </View>

          <View style={styles.footer}>
            <View style={styles.priceRow}>
              <Text style={styles.pricePrimary}>{priceLabel}</Text>
              <Text style={styles.priceSecondary}>{secondaryLabel}</Text>
            </View>

            <AppButton title="Попробовать бесплатно" onPress={onTryFree} />

            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.notNow, pressed && styles.notNowPressed]}
            >
              <Text style={styles.notNowText}>Не сейчас</Text>
            </Pressable>

            <Text style={styles.legal}>
              Нажимая «Попробовать бесплатно», ты соглашаешься начать Premium в
              прототипе. Это локальное состояние (без оплат и без backend).
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <View style={styles.benefitRow}>
      <View style={styles.bullet} />
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

type PlanCardProps = {
  title: string;
  price: string;
  period: string;
  helper: string;
  selected: boolean;
  onPress: () => void;
  badge?: string;
  emphasize?: boolean;
};

function PlanCard({
  title,
  price,
  period,
  helper,
  selected,
  onPress,
  badge,
  emphasize,
}: PlanCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.planCard,
        emphasize ? styles.planCardEmphasize : null,
        selected ? styles.planCardSelected : null,
        pressed ? styles.planCardPressed : null,
      ]}
    >
      <View style={styles.planTopRow}>
        <Text style={styles.planTitle}>{title}</Text>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.planPriceRow}>
        <Text style={styles.planPrice}>{price}</Text>
        <Text style={styles.planPeriod}>{period}</Text>
      </View>

      <Text style={styles.planHelper}>{helper}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 22,
    gap: 14,
  },
  hero: { gap: 10, paddingTop: 2, paddingBottom: 6 },
  kicker: {
    color: "rgba(234,240,255,0.72)",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: "#EAF0FF",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  subtitle: { color: "rgba(201,211,240,0.86)", fontSize: 15, lineHeight: 22 },

  benefitsCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    gap: 12,
  },
  sectionTitle: { color: "#EAF0FF", fontSize: 16, fontWeight: "800" },
  benefitsList: { gap: 10 },
  benefitRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(110,139,255,0.95)",
    marginTop: 6,
  },
  benefitText: { flex: 1, color: "#C9D3F0", fontSize: 14, lineHeight: 20 },

  plans: { gap: 10, paddingTop: 4 },
  planCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    gap: 10,
  },
  planCardEmphasize: {
    backgroundColor: "rgba(110,139,255,0.10)",
    borderColor: "rgba(110,139,255,0.35)",
  },
  planCardSelected: {
    borderColor: "rgba(234,240,255,0.30)",
    shadowColor: "#6E8BFF",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  planCardPressed: { opacity: 0.96, transform: [{ scale: 0.995 }] },
  planTopRow: { flexDirection: "row", alignItems: "center" },
  planTitle: { flex: 1, color: "#EAF0FF", fontSize: 16, fontWeight: "900" },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(110,139,255,0.20)",
    borderWidth: 1,
    borderColor: "rgba(110,139,255,0.40)",
  },
  badgeText: {
    color: "#EAF0FF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  planPriceRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  planPrice: { color: "#EAF0FF", fontSize: 22, fontWeight: "900" },
  planPeriod: { color: "rgba(201,211,240,0.78)", fontSize: 13, fontWeight: "700" },
  planHelper: { color: "rgba(201,211,240,0.88)", fontSize: 13, lineHeight: 18 },

  footer: { gap: 10, paddingTop: 6 },
  priceRow: { gap: 4, paddingBottom: 2 },
  pricePrimary: { color: "#EAF0FF", fontSize: 16, fontWeight: "900" },
  priceSecondary: { color: "rgba(201,211,240,0.78)", fontSize: 13, lineHeight: 18 },
  notNow: {
    minHeight: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(0,0,0,0.10)",
  },
  notNowPressed: { opacity: 0.9, transform: [{ scale: 0.995 }] },
  notNowText: { color: "rgba(234,240,255,0.90)", fontSize: 15, fontWeight: "800" },
  legal: {
    color: "rgba(174,185,214,0.72)",
    fontSize: 12,
    lineHeight: 16,
    paddingTop: 4,
  },
});

