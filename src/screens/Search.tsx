import { SearchProps } from "./Navigator";
import React from "react";
import { StyleSheet, TextInput as RNTextInput, useColorScheme, View } from "react-native";
import { Button, Divider, Menu, RadioButton, TextInput, TouchableRipple } from "react-native-paper";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { DatePickerModal } from "react-native-paper-dates";
import { monthDayYear } from "../utils/date";
import { Text } from "../components";
import { SeasonYear } from "vex-qna-archiver";
import { useFocusEffect } from "@react-navigation/native";

export function Search({ navigation, route }: SearchProps) {
  const [beforeVisible, setBeforeVisible] = React.useState(false);
  const [afterVisible, setAfterVisible] = React.useState(false);
  const [seasonVisible, setSeasonVisible] = React.useState(false);

  const [before, setBefore] = React.useState<Date | undefined>(undefined);
  const [after, setAfter] = React.useState<Date | undefined>(undefined);
  const [query, setQuery] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [selectedSeason, setSelectedSeason] = React.useState<SeasonYear>(route.params.allSeasons[route.params.allSeasons.length - 1]);

  const { theme } = useMaterial3Theme();
  const colorScheme = useColorScheme();


  useFocusEffect(
    React.useCallback(() => {
      setAfter(undefined);
      setBefore(undefined);
      setAuthor("");
      setQuery("");
      setSelectedSeason(route.params.allSeasons[route.params.allSeasons.length - 1]);
    }, [])
  );
  return (
    <View style={[styles.container, { backgroundColor: theme[colorScheme].background }]}>
      <View style={styles.body}>
        <View style={styles.params}>
          <TextInput
            mode={"outlined"}
            label={"Search Query"}
            onChangeText={setQuery}
            value={query}
          />
          <TextInput label={"Author"} mode={"outlined"} value={author} onChangeText={setAuthor} />
          <View style={styles.dates}>
            <View style={{ flex: 1, rowGap: 5 }}>
              <Text variant={"labelLarge"}>Before</Text>
              <Button onPress={() => setBeforeVisible(true)} uppercase={false} mode="outlined">
                {before ? monthDayYear(before) : "------"}
              </Button>
            </View>
            <View style={{ flex: 1, rowGap: 5 }}>
              <Text variant={"labelLarge"}>After</Text>
              <Button onPress={() => setAfterVisible(true)} uppercase={false} mode="outlined">
                {after ? monthDayYear(after) : "------"}
              </Button>
            </View>
          </View>
          <View style={styles.season}>
            <Menu
              style={{ padding: 5 }}
              visible={seasonVisible}
              onDismiss={() => setSeasonVisible(false)}
              anchor={
                <View style={{ rowGap: 5 }}>
                  <Text variant={"labelLarge"}>Season</Text>
                  <Button mode={"outlined"} onPress={() => setSeasonVisible(true)}>
                    <Text>{selectedSeason}</Text>
                  </Button>
                </View>
              }>
              {route.params.allSeasons.map((season, i) => (
                <View key={i}>
                  <TouchableRipple
                    style={{ paddingRight: 10 }}
                    onPress={() => setSelectedSeason(season as SeasonYear)}>
                    <View style={styles.seasonItem}>
                      <RadioButton
                        status={selectedSeason === season ? "checked" : "unchecked"}
                        value={season}
                      />
                      <Text variant={"bodyMedium"}>{season}</Text>
                    </View>
                  </TouchableRipple>
                </View>
              ))}
            </Menu>
          </View>
          <DatePickerModal
            locale="en"
            mode="single"
            visible={beforeVisible}
            onDismiss={() => setBeforeVisible(false)}
            date={before}
            onConfirm={(params) => {
              setBefore(params.date);
              setBeforeVisible(false);
            }}
          />
          <DatePickerModal
            locale="en"
            mode="single"
            visible={afterVisible}
            onDismiss={() => setAfterVisible(false)}
            date={after}
            onConfirm={(params) => {
              setAfter(params.date);
              setAfterVisible(false);
            }}
          />
        </View>
        <Divider />
        <View>
          <Button
            style={styles.submit}
            mode={"outlined"}
            onPress={() => {
              navigation.navigate("Home", {
                query,
                author,
                before: before ? before.getTime() : undefined,
                after: after ? after.getTime() : undefined,
                season: selectedSeason,
                newSearch: true
              });
            }}
          >Search</Button>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  body: {
    flex: 1,
    padding: 15,
    rowGap: 10
  },
  params: {
    flex: 1,
    rowGap: 10
  },
  dates: {
    flexDirection: "row",
    columnGap: 15
  },
  season: {},
  seasonItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    margin: 0,
    columnGap: 5
  },
  submit: {
    alignSelf: "flex-end"
  },
  header: {
    backgroundColor: "#D22630",
    color: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    paddingVertical: 15,
    paddingHorizontal: 5
  }
});
