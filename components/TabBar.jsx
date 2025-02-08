import { View, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import TabBarButton from "./TabBarButton";

const TabBar = ({ state, descriptors, navigation }) => {
  const primaryColor = "#0891b2";
  const greyColor = "#737373";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabbar}>
        {state.routes.map((route, index) => {
          if (["_sitemap", "+not-found"].includes(route.name)) return null;

          const { options } = descriptors[route.key] || {};
          const label = options?.tabBarLabel || options?.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={route.name}
              style={styles.tabbarItem}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              routeName={route.name}
              color={isFocused ? primaryColor : greyColor}
              label={label}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  tabbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 4, // Tạo bóng trên Android
    shadowColor: "#000", // Bóng trên iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

export default TabBar;
