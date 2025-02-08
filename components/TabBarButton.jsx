import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { icons } from "../assets/tabIcons";

const TabBarButton = ({ isFocused, label, routeName, color, ...props }) => {
  const scale = useDerivedValue(() =>
    withSpring(isFocused ? 1 : 0, { damping: 10, stiffness: 100 })
  );

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scale.value, [0, 1], [1, 1.4]) }],
    top: interpolate(scale.value, [0, 1], [0, 8]),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scale.value, [0, 1], [1, 0]),
  }));

  return (
    <Pressable style={styles.container} {...props}>
      <Animated.View style={animatedIconStyle}>
        {icons[routeName] ? icons[routeName]({ color }) : <Text>❓</Text>}
      </Animated.View>

      <Animated.Text style={[styles.text, { color }, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontSize: 8,
  },
});

export default TabBarButton;
