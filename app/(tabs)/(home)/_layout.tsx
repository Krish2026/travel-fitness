import { theme } from "@/theme";
import { Link, Stack } from "expo-router";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Pressable } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerRight: () => (
            <Link href="/new" asChild>
              <Pressable hitSlop={20}>
                <AntDesign
                  name="plus-circle"
                  size={24}
                  color={theme.colorGreen}
                />
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="plants/[plantId]"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
}
