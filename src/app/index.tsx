import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "../components/AppButton";
import { getIsSubscribed } from "../lib/storage";

type Meditation = {
  id: string;
  title: string;
  description: string;
  duration: string;
  isPremium: boolean;
};

type Mood = "calm" | "stress" | "tired";

const MEDITATIONS: Meditation[] = [
  {
    id: "m1",
    title: "5-minute Reset",
    description: "Сброс напряжения и мягкий фокус за несколько дыханий.",
    duration: "5 min",
    isPremium: false,
  },
  {
    id: "m2",
    title: "Calm Body Scan",
    description: "Медленный скан тела для спокойствия и расслабления.",
    duration: "10 min",
    isPremium: true,
  },
  {
    id: "m3",
    title: "Morning Clarity",
    description: "Лёгкая практика, чтобы начать день яснее и мягче.",
    duration: "7 min",
    isPremium: false,
  },
  {
    id: "m4",
    title: "Deep Sleep Wind Down",
    description: "Тихая подготовка ко сну с плавным замедлением.",
    duration: "12 min",
    isPremium: true,
  },
  {
    id: "m5",
    title: "Anxiety Ease",
    description: "Заземление и спокойствие, когда мысли ускоряются.",
    duration: "8 min",
    isPremium: true,
  },
  {
    id: "m6",
    title: "Focus Sprint",
    description: "Короткая настройка внимания перед задачей.",
    duration: "6 min",
    isPremium: false,
  },
];

export default function Index() {
  const [isSubscribed, setIsSubscribedState] = useState<boolean | null>(null);
  const [comingSoon, setComingSoon] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood>("calm");
  const [isGeneratingMood, setIsGeneratingMood] = useState(false);
  const [aiMoodText, setAiMoodText] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const value = await getIsSubscribed();
      if (!cancelled) setIsSubscribedState(value);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const headerDescription = useMemo(() => {
    if (isSubscribed === null) return "Загружаем…";
    if (isSubscribed) return "Твои практики доступны полностью. Выбирай и начинай.";
    return "Часть практик Premium — открой доступ, когда будешь готов.";
  }, [isSubscribed]);

  const onPressMeditation = (item: Meditation) => {
    if (isSubscribed === null) return;
    const locked = item.isPremium && isSubscribed === false;
    if (locked) {
      router.push("/paywall");
      return;
    }
    setComingSoon(`Coming soon: ${item.title}`);
  };

  const buildMoodPrompt = (mood: Mood): string => {
    const moodLabel =
      mood === "calm" ? "Спокойно" : mood === "stress" ? "Стресс" : "Устал";

    return [
      "Ты - AI коуч приложения ZenPulse.",
      `Настроение пользователя: ${moodLabel}.`,
      "Задача: вернуть 1 короткую аффирмацию или мини-медитацию на 2-3 предложения.",
      "Тон: мягкий, спокойный, поддерживающий, без эзотерики.",
      "Язык: русский.",
    ].join(" ");
  };

  const getMockMoodResponse = (mood: Mood): string => {
    const variants: Record<Mood, string[]> = {
      calm: [
        "Ты уже в хорошем ритме. Сделай 5 медленных вдохов и выдохов, замечая, как тело становится еще мягче. Сохрани это спокойствие как опору на весь день.",
        "Спокойствие уже внутри тебя. На вдохе скажи мысленно: «Я здесь», на выдохе: «Мне достаточно этого момента». Пусть день идет в твоем темпе.",
      ],
      stress: [
        "Сейчас достаточно замедлиться на одну минуту. Положи ладонь на грудь и выдыхай чуть длиннее, чем вдыхаешь. С каждым выдохом возвращай себе ощущение контроля.",
        "Когда мыслей слишком много, выбери одну точку внимания: дыхание у кончика носа. Сделай 6 ровных циклов вдох-выдох и отпусти лишнее. Ты в безопасности в этом моменте.",
      ],
      tired: [
        "Усталость — это сигнал о заботе о себе, а не слабость. Закрой глаза на 20 секунд и расслабь плечи, челюсть, живот. Разреши себе мягкий перезапуск.",
        "Тебе не нужен идеальный ресурс прямо сейчас — достаточно маленького шага. Сделай 4 глубоких вдоха, расправь грудную клетку и поблагодари себя за этот день.",
      ],
    };

    const items = variants[mood];
    return items[Math.floor(Math.random() * items.length)];
  };

  const onGenerateMood = async () => {
    if (isGeneratingMood) return;

    setIsGeneratingMood(true);
    setAiMoodText(null);

    const delay = 600 + Math.floor(Math.random() * 301);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const prompt = buildMoodPrompt(selectedMood);
    const response = getMockMoodResponse(selectedMood);
    void prompt;

    setAiMoodText(response);
    setIsGeneratingMood(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <FlatList
        data={MEDITATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Meditations</Text>
            <Text style={styles.subtitle}>{headerDescription}</Text>

            <View style={styles.aiCard}>
              <Text style={styles.aiTitle}>AI Настрой дня</Text>
              <Text style={styles.aiSubtitle}>
                Выбери состояние и получи короткую практику от AI.
              </Text>

              <View style={styles.moodRow}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setSelectedMood("calm")}
                  style={({ pressed }) => [
                    styles.moodButton,
                    selectedMood === "calm" ? styles.moodButtonActive : null,
                    pressed ? styles.moodButtonPressed : null,
                  ]}
                >
                  <Text style={styles.moodEmoji}>😌</Text>
                  <Text style={styles.moodLabel}>Спокойно</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => setSelectedMood("stress")}
                  style={({ pressed }) => [
                    styles.moodButton,
                    selectedMood === "stress" ? styles.moodButtonActive : null,
                    pressed ? styles.moodButtonPressed : null,
                  ]}
                >
                  <Text style={styles.moodEmoji}>😵</Text>
                  <Text style={styles.moodLabel}>Стресс</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => setSelectedMood("tired")}
                  style={({ pressed }) => [
                    styles.moodButton,
                    selectedMood === "tired" ? styles.moodButtonActive : null,
                    pressed ? styles.moodButtonPressed : null,
                  ]}
                >
                  <Text style={styles.moodEmoji}>😴</Text>
                  <Text style={styles.moodLabel}>Устал</Text>
                </Pressable>
              </View>

              <AppButton
                title={
                  isGeneratingMood ? "Генерируем настрой..." : "Сгенерировать настрой"
                }
                onPress={onGenerateMood}
                disabled={isGeneratingMood}
              />

              {isGeneratingMood ? (
                <View style={styles.aiResultCard}>
                  <Text style={styles.aiLoadingText}>
                    AI подбирает мягкую практику под твое состояние...
                  </Text>
                </View>
              ) : null}

              {aiMoodText ? (
                <View style={styles.aiResultCard}>
                  <Text style={styles.aiResultTitle}>Твой настрой</Text>
                  <Text style={styles.aiResultText}>{aiMoodText}</Text>
                </View>
              ) : null}
            </View>

            {comingSoon ? (
              <View style={styles.notice}>
                <Text style={styles.noticeText}>{comingSoon}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setComingSoon(null)}
                  style={({ pressed }) => [
                    styles.noticeAction,
                    pressed && styles.noticeActionPressed,
                  ]}
                >
                  <Text style={styles.noticeActionText}>OK</Text>
                </Pressable>
              </View>
            ) : null}

            {isSubscribed === false ? (
              <AppButton
                title="Открыть ZenPulse Premium"
                onPress={() => router.push("/paywall")}
              />
            ) : null}
          </View>
        }
        renderItem={({ item }) => {
          const locked = item.isPremium && isSubscribed === false;
          const disabledLike = locked || isSubscribed === null;

          return (
            <Pressable
              accessibilityRole="button"
              disabled={isSubscribed === null}
              onPress={() => onPressMeditation(item)}
              style={({ pressed }) => [
                styles.card,
                locked ? styles.cardLocked : null,
                pressed && !disabledLike ? styles.cardPressed : null,
              ]}
            >
              <View style={styles.cardTopRow}>
                <View style={[styles.visual, locked ? styles.visualLocked : null]}>
                  <View style={styles.visualInner} />
                </View>
                <View style={styles.cardMeta}>
                  <Text
                    style={[styles.cardTitle, locked ? styles.textMuted : null]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <View style={styles.pills}>
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>{item.duration}</Text>
                    </View>
                    {item.isPremium ? (
                      <View style={[styles.pill, styles.pillPremium]}>
                        <Text style={styles.pillText}>Premium</Text>
                      </View>
                    ) : (
                      <View style={[styles.pill, styles.pillFree]}>
                        <Text style={styles.pillText}>Free</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[styles.cardText, locked ? styles.textMuted : null]}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>

              {locked ? (
                <View style={styles.lockRow}>
                  <Text style={styles.lockText}>Locked</Text>
                  <Text style={styles.lockHint}>Открыть через Premium</Text>
                </View>
              ) : (
                <Text style={styles.ctaText}>Tap to start (Coming soon)</Text>
              )}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0B1220" },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    gap: 12,
  },
  header: { gap: 10, paddingBottom: 4 },
  title: {
    color: "#EAF0FF",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  subtitle: { color: "rgba(201,211,240,0.86)", fontSize: 14, lineHeight: 20 },
  notice: {
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  noticeText: { flex: 1, color: "#EAF0FF", fontSize: 13, lineHeight: 18 },
  noticeAction: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(110,139,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(110,139,255,0.35)",
  },
  noticeActionPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  noticeActionText: { color: "#EAF0FF", fontSize: 13, fontWeight: "800" },
  aiCard: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 12,
    gap: 10,
  },
  aiTitle: { color: "#EAF0FF", fontSize: 17, fontWeight: "900" },
  aiSubtitle: { color: "rgba(201,211,240,0.86)", fontSize: 13, lineHeight: 18 },
  moodRow: { flexDirection: "row", gap: 8 },
  moodButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  moodButtonActive: {
    borderColor: "rgba(110,139,255,0.45)",
    backgroundColor: "rgba(110,139,255,0.14)",
  },
  moodButtonPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  moodEmoji: { fontSize: 18 },
  moodLabel: { color: "#EAF0FF", fontSize: 12, fontWeight: "800" },
  aiResultCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(11,18,32,0.45)",
    padding: 10,
    gap: 6,
  },
  aiLoadingText: { color: "rgba(201,211,240,0.88)", fontSize: 13, lineHeight: 18 },
  aiResultTitle: { color: "#EAF0FF", fontSize: 13, fontWeight: "900" },
  aiResultText: { color: "rgba(201,211,240,0.92)", fontSize: 13, lineHeight: 19 },
  card: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 14,
    gap: 10,
  },
  cardPressed: { opacity: 0.96, transform: [{ scale: 0.995 }] },
  cardLocked: { opacity: 0.55 },
  cardTopRow: { flexDirection: "row", gap: 12 },
  visual: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(110,139,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(110,139,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  visualLocked: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.14)",
  },
  visualInner: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: "rgba(234,240,255,0.65)",
  },
  cardMeta: { flex: 1, gap: 6 },
  cardTitle: { color: "#EAF0FF", fontSize: 16, fontWeight: "900" },
  pills: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  pillFree: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.10)",
  },
  pillPremium: {
    backgroundColor: "rgba(110,139,255,0.14)",
    borderColor: "rgba(110,139,255,0.26)",
  },
  pillText: { color: "rgba(234,240,255,0.90)", fontSize: 12, fontWeight: "800" },
  cardText: { color: "rgba(201,211,240,0.88)", fontSize: 13, lineHeight: 18 },
  textMuted: { color: "rgba(201,211,240,0.65)" },
  lockRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 2,
  },
  lockText: { color: "#EAF0FF", fontSize: 12, fontWeight: "900" },
  lockHint: { color: "rgba(201,211,240,0.78)", fontSize: 12, fontWeight: "700" },
  ctaText: { color: "rgba(174,185,214,0.80)", fontSize: 12, fontWeight: "700" },
});
