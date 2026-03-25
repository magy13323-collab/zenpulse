import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import type { AppButtonVariant } from "../types";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: AppButtonVariant;
  style?: ViewStyle;
};

export function AppButton({
  title,
  onPress,
  disabled,
  variant = "primary",
  style,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      <Text style={[styles.textBase, textVariantStyles[variant]]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  pressed: { transform: [{ scale: 0.99 }], opacity: 0.95 },
  disabled: { opacity: 0.5 },
  textBase: { fontSize: 16, fontWeight: "700" },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: "#6E8BFF",
    borderColor: "#6E8BFF",
  },
  secondary: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.14)",
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "rgba(255,255,255,0.18)",
  },
} as const);

const textVariantStyles = StyleSheet.create({
  primary: { color: "#0B1220" },
  secondary: { color: "#EAF0FF" },
  ghost: { color: "#EAF0FF" },
} as const);

