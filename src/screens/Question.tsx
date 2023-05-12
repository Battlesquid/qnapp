import React from "react";
import { QuestionProps } from "./Navigator";
import { Linking, ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { IconLabel, Text } from "../components";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { ActivityIndicator, Chip, Divider, IconButton, Snackbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SubscribedQuestion } from "../modules/background";

export function Question({ navigation, route }: QuestionProps) {
  const {
    id,
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
  const [loading, setLoading] = React.useState(true);
  const [subscribed, setIsSubscribed] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [fulfilled, setFulfilled] = React.useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem("@qnapp/subscribed")
      .then(result => {
        if (result === null) {
          return;
        }
        const stored: SubscribedQuestion = JSON.parse(result);
        if (stored[id] !== undefined) {
          setIsSubscribed(stored[id].fulfilled);
          setFulfilled(stored[id].fulfilled);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme[colorScheme].background }]}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, rowGap: 10 }}>
          <View style={styles.title}>
            {answered && <Icon name={"check-circle"} size={20} color={"#52b43a"} />}
            <Text style={{ flex: 1 }} variant={"bold"}>{title}</Text>
          </View>
          <View style={styles.details}>
            <IconLabel icon={"account"} label={author} />
            <IconLabel icon={"clock-time-five"} label={timestamp} />
          </View>
        </View>
        <View>
          <IconButton
            icon={"open-in-new"}
            size={24}
            onPress={() => Linking.openURL(url)}
          />
          <IconButton
            icon={subscribed && !fulfilled ? "bell" : "bell-outline"}
            size={24}
            disabled={answered}
            onPress={async () => {
              let data = await AsyncStorage.getItem("@qnapp/subscribed");
              if (data === null) {
                data = "{}";
              }
              const stored: SubscribedQuestion = JSON.parse(data);
              if (stored[id] !== undefined) {
                delete stored[id];
                setIsSubscribed(false);
                setSnackbarVisible(true);
              } else {
                stored[id] = {
                  fulfilled: false,
                  data: { title, author }
                };
                setIsSubscribed(true);
                setSnackbarVisible(true);
              }
              AsyncStorage.setItem("@qnapp/subscribed", JSON.stringify(stored));
            }} />
        </View>
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
      <Snackbar
        visible={snackbarVisible}
        elevation={4}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "Dismiss",
          onPress: () => setSnackbarVisible(false)
        }}
      >
        {`${subscribed ? "Subscribed to" : "Unsubscribed from"} question ${id}`}
      </Snackbar>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    rowGap: 5,
    justifyContent: "space-between"
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
