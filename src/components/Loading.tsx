import { StyleSheet, useColorScheme, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import React from "react";
import { Text } from "./Text";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

export function Loading() {
  const { theme } = useMaterial3Theme();
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.loading, { backgroundColor: theme[colorScheme].background }]}>
      <ActivityIndicator />
      <Text variant={"labelLarge"}>Loading</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  loading: {
    flex: 1,
    rowGap: 5,
    justifyContent: "center",
    alignItems: "center"
  }
});
