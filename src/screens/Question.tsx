import React from "react";
import { QuestionProps } from "./Navigator";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { IconLabel, Text } from "../components";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { Chip, Divider, IconButton } from "react-native-paper";

export function Question({ navigation, route }: QuestionProps) {
  const {
    title,
    question,
    answer,
    answered,
    author,
    tags,
    timestamp,
    season,
    url
  } = route.params;

  const { theme } = useMaterial3Theme();
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, { backgroundColor: theme[colorScheme].background }]}>
      <View style={styles.title}>
        <Text variant={"bold"}>{title}</Text>
        <IconButton icon={"open-in-new"} size={24} />
      </View>
      <View style={styles.details}>
        <IconLabel icon={"account"} label={author} />
        <IconLabel icon={"clock-time-five"} label={timestamp} />
      </View>
      <Divider />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ rowGap: 5 }}>
          <Text variant={"bold"}>Question</Text>
          <Text variant={"bodyMedium"}>{question}</Text>
        </View>
        <Divider />
        <View style={{ rowGap: 5 }}>
          <Text variant={"bold"}>Answer</Text>
          <Text variant={"bodyMedium"}>{answer}</Text>
        </View>
        <Divider />
        <View style={styles.tags}>
          {tags.length ?
            tags.map((t, i) => (
              <Chip key={i}>{t}</Chip>
            )) : (
              <Chip>No Tags</Chip>
            )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    rowGap: 5
  },
  details: {
    rowGap: 5
  },
  scroll: {
    padding: 5,
    rowGap: 20
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 10
  },
  tags: {
    flexDirection: "row",
    columnGap: 10,
    paddingBottom: 5
  }
});
