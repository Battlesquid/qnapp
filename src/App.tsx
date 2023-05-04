import React from "react";
import { StyleSheet } from "react-native";
import { Question } from "vex-qna-archiver/dist/entities/Question";

interface QuestionResponse {
  data: Question[];
  next: boolean;
}

function App(): JSX.Element {
  return (
    <></>
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
  }
});

export default App;
