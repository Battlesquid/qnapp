import { NotificationsProps } from "./Navigator";
import React from "react";
import { FlatList, StyleSheet, useColorScheme, View } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

export function Notifications(props: NotificationsProps) {
  const { theme } = useMaterial3Theme();
  const colorScheme = useColorScheme();
  const [subscribed, setSubscribed] = React.useState([]);

  return (
    <View style={[styles.container, { backgroundColor: theme[colorScheme].background }]}>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  }

});
