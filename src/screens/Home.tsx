import { HomeProps } from "./Navigator";
import React from "react";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { FlatList, StyleSheet, useColorScheme, View } from "react-native";
import { IconLabel, Text } from "../components";
import { ActivityIndicator, Divider, FAB, TouchableRipple } from "react-native-paper";
import { getAllSeasons, QuestionData, SeasonYear } from "vex-qna-archiver";
import { useFocusEffect } from "@react-navigation/native";
import { monthDayYear } from "../utils/date";
import { searchQuestions } from "../modules/qnapi";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface QuestionResponse {
  data: QuestionData[];
  next: boolean;
}

export function Home({ navigation, route }: HomeProps) {
  const [questions, setQuestions] = React.useState<QuestionData[]>([]);
  const [hasNext, setHasNext] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);

  const [selectedSeason, setSelectedSeason] = React.useState<SeasonYear | undefined>(route.params.season);
  const [allSeasons, setAllSeasons] = React.useState<SeasonYear[]>([]);
  const { theme } = useMaterial3Theme();
  const colorScheme = useColorScheme();

  const limit = 10;

  const search = () => {
    const promises: Promise<QuestionResponse | SeasonYear[] | void>[] = [];
    setLoading(true);

    promises.push(
      searchQuestions({
        search_query: route.params.query,
        author: route.params.author,
        before: route.params.before ? monthDayYear(new Date(route.params.before)) : undefined,
        after: route.params.after ? monthDayYear(new Date(route.params.after)) : undefined,
        season: route.params.season,
        page,
        limit
      })
        .then(({ data, next }) => {
          setQuestions(old => [...old, ...data].filter((q, i, arr) => arr.findIndex(r => q.id === r.id) === i));
          setHasNext(next);
        })
    );

    if (allSeasons.length === 0) {
      promises.push(getAllSeasons().then(setAllSeasons));
    }

    Promise.all(promises)
      .finally(() => {
        setLoading(false);
      });
  };

  const renderRow = React.useCallback(({ item: question }) => {
    const formattedAuthor = question.author;
    return (
      <TouchableRipple
        key={question.id}
        style={styles.question}
        onPress={() => navigation.navigate("Question", question)}
      >
        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}>
          {question.answered && <Icon name={"check-circle"} size={20} color={"#52b43a"} />}
          <View style={styles.questionContainer}>
            <Text numberOfLines={2} variant={"bold"}>{question.title}</Text>
            <View style={styles.details}>
              <IconLabel icon={"clock-time-five"} label={question.timestamp} />
              <IconLabel icon={"account"} label={formattedAuthor} />
            </View>
          </View>
        </View>
      </TouchableRipple>
    );
  }, []);

  const renderFooter = React.useCallback(() => {
    if (hasNext || loading) {
      return (
        <View style={{ padding: 5 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ padding: 15, justifyContent: "center", alignItems: "center" }}>
        <Divider />
        <Text>No more results.</Text>
      </View>
    );
  }, [hasNext, loading]);

  React.useEffect(() => {
    search();
  }, [page]);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params.newSearch) {
        setQuestions([]);
        if (page === 1) {
          search();
        } else {
          setPage(1);
        }
      }
    }, [route])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme[colorScheme].background }]}>
      <View style={styles.body}>
        <FlatList
          data={questions}
          renderItem={renderRow}
          ListFooterComponent={renderFooter}
          ItemSeparatorComponent={Divider}
          keyExtractor={item => item.id}
          onEndReachedThreshold={0.1}
          initialNumToRender={limit}
          onEndReached={({ distanceFromEnd }) => {
            if (hasNext && distanceFromEnd > 0 && !loading) {
              setPage(page + 1);
            }
          }}
        />
      </View>
      <FAB
        style={styles.search}
        icon={"magnify"}
        customSize={64}
        onPress={() => navigation.navigate("Search", {
          allSeasons
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: "#D22630",
    color: "#FFFFFF"
  },
  body: {
    flex: 1
  },
  search: {
    borderRadius: 50,
    bottom: 16,
    right: 16,
    position: "absolute"
  },
  details: {
    flex: 1,
    flexDirection: "row",
    columnGap: 15
  },
  questionContainer: {
    rowGap: 5
  },
  question: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingRight: 40
  }
});
