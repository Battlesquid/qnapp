import { HomeProps } from "./Navigator";
import React from "react";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { FlatList, ListRenderItemInfo, StyleSheet, useColorScheme, View } from "react-native";
import axios, { HttpStatusCode } from "axios/index";
import { IconLabel, Text } from "../components";
import { Divider, FAB, TouchableRipple } from "react-native-paper";
import { getAllSeasons, QuestionData, SeasonYear } from "vex-qna-archiver";
import { Loading } from "../components/Loading";
import { useFocusEffect } from "@react-navigation/native";
import { monthDayYear } from "../utils/date";

interface QuestionResponse {
  data: QuestionData[];
  next: boolean;
}

export function Home({ navigation, route }: HomeProps) {
  const [questions, setQuestions] = React.useState<QuestionData[]>([]);
  const [hasNext, setHasNext] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);

  const [selectedSeason, setSelectedSeason] = React.useState<SeasonYear | undefined>(route.params.season);
  const [allSeasons, setAllSeasons] = React.useState<SeasonYear[]>([]);
  const { theme } = useMaterial3Theme();
  const colorScheme = useColorScheme();
  console.log(route.params.author);
  const limit = 10;
  const params = [
    { name: "search_query", value: route.params.query },
    { name: "author", value: route.params.author },
    { name: "before", value: route.params.before ? monthDayYear(new Date(route.params.before)) : undefined },
    { name: "after", value: route.params.after ? monthDayYear(new Date(route.params.after)) : undefined },
    { name: "season", value: route.params.season }
  ].filter(p => Boolean(p.value)).map(p => `${p.name}=${p.value}`).join("&");

  const search = (append: boolean) => {
    const promises: Promise<QuestionResponse | SeasonYear[] | void>[] = [];

    console.log(page);
    promises.push(
      axios.get<QuestionResponse>(`https://qnapi-production-b8f0.up.railway.app/search?${params}&limit=${limit}&page=${page}`)
        .then(response => {
          if (response.status === HttpStatusCode.Ok) {
            if (append) {
              setQuestions(old => [...old, ...response.data.data.slice(0, limit)]);
            } else {
              setQuestions(response.data.data.slice(0, limit));
            }
            setHasNext(response.data.next);
          }
        })
    );

    if (allSeasons.length === 0) {
      promises.push(getAllSeasons()
        .then(seasons => {
          console.log(seasons);
          setAllSeasons(seasons);
          setSelectedSeason(seasons[seasons.length - 1]);
        }));
    }

    Promise.all(promises)
      .catch(() => {

      })
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
        <View style={styles.questionContainer}>
          <Text numberOfLines={2} variant={"bold"}>{question.title}</Text>
          <View style={styles.details}>
            <IconLabel icon={"clock-time-five"} label={question.timestamp} />
            <IconLabel icon={"account"} label={formattedAuthor} />
          </View>
        </View>
      </TouchableRipple>
    );
  }, []);

  React.useEffect(() => {
    search(true);
  }, [page]);

  useFocusEffect(
    React.useCallback(() => {
      search(false);
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme[colorScheme].background }]}>
      <View style={styles.body}>
        <FlatList
          onEndReached={() => {
            if (hasNext) {
              console.log("Next Page");
              setPage(old => old + 1);
            }
          }}
          ItemSeparatorComponent={Divider}
          keyExtractor={item => item.id}
          data={questions}
          renderItem={renderRow}
        />
      </View>
      <FAB
        style={styles.search}
        icon={"magnify"}
        customSize={64}
        onPress={() => navigation.navigate("Search", {
          query: route.params.query,
          season: selectedSeason,
          before: route.params.before,
          after: route.params.after,
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
