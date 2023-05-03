import React from "react";
import { FlatList, StyleSheet, useColorScheme, View } from "react-native";
import { AnimatedFAB, Appbar, TouchableRipple } from "react-native-paper";
import { Question } from "vex-qna-archiver/dist/entities/Question";
import axios, { HttpStatusCode } from "axios";
import { IconLabel, Text } from "./components";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

interface QuestionResponse {
  data: Question[];
  next: boolean;
}

function App(): JSX.Element {
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [hasNext, setHasNext] = React.useState(false);
  const [searchExtended, setSearchExtended] = React.useState(false);
  const { theme } = useMaterial3Theme({ sourceColor: "#D22630" });

  const [page, setPage] = React.useState(1);
  const [query, setQuery] = React.useState("goals");
  const [limit, setLimit] = React.useState(20);

  const colorScheme = useColorScheme();

  React.useEffect(() => {
    axios.get<QuestionResponse>(`https://qnapi-production-b8f0.up.railway.app/search?search_query=${query}&page=${page}&limit=${limit}`)
      .then(response => {
        if (response.status === HttpStatusCode.Ok) {
          setQuestions(old => [...old, ...response.data.data.slice(0, limit)]);
          setHasNext(response.data.next);
        }
      });
  }, [page]);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setSearchExtended(currentScrollPosition <= 0);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme[colorScheme].background }]}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title={"Title"} />
        <Appbar.Action icon={"bell"} />
      </Appbar.Header>
      <View style={styles.questions}>
        <FlatList
          onScroll={onScroll}
          style={styles.questions}
          onEndReached={() => {
            if (hasNext) {
              setPage(old => old + 1);
            }
          }}
          keyExtractor={item => item.id}
          data={questions}
          renderItem={({ item: question }) => {
            const formattedAuthor = question.author;
            const formattedTags = question.tags.length > 0 ? question.tags.join(", ") : "None";
            return (
              <TouchableRipple
                key={question.id}
                style={styles.question}
                onPress={() => {
                }}
              >
                <View style={styles.questionContainer}>
                  <Text numberOfLines={1} variant={"titleLarge"}>{question.title}</Text>
                  <View style={styles.details}>
                    <IconLabel icon={"account"} label={formattedAuthor} />
                    <IconLabel icon={"clock-time-five"} label={question.timestamp} />
                    <IconLabel icon={"tag-multiple"} label={formattedTags} />
                  </View>
                </View>
              </TouchableRipple>
            );
          }} />
      </View>
      <AnimatedFAB
        icon={"magnify"}
        label={"Search"}
        extended={searchExtended}
        onPress={() => console.log("Pressed")}
        style={[styles.search]}
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
  details: {
    flex: 1,
    flexDirection: "row",
    columnGap: 15
  },
  questions: {
    flex: 1
  },
  questionContainer: {
    rowGap: 2
  },
  question: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingRight: 40
  },
  search: {
    borderRadius: 50,
    bottom: 16,
    right: 16,
    position: "absolute"
  }
});

export default App;
