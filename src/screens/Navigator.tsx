import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Home } from "./Home";
import { Search } from "./Search";
import { Question } from "./Question";
import { Notifications } from "./Notifications";
import { Text } from "../components";
import { QuestionData, SeasonYear } from "vex-qna-archiver";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";

export type RootStackParamList = {
  Home: {
    before?: number;
    after?: number;
    query?: string
    author?: string;
    season?: SeasonYear;
  };
  Search: {
    before?: number;
    after?: number;
    query?: string
    author?: string;
    season: SeasonYear;
    allSeasons?: string[];
  };
  Notifications: undefined;
  Question: QuestionData;
};

export type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">
export type SearchProps = NativeStackScreenProps<RootStackParamList, "Search">
export type NotificationsProps = NativeStackScreenProps<RootStackParamList, "Notifications">
export type QuestionProps = NativeStackScreenProps<RootStackParamList, "Question">

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#D22630" },
          headerTitleStyle: { color: "#FFFFFF", fontWeight: "800" },
          header: (props) => (
            <View>
              <View style={styles.statusBar}>
                <SafeAreaView>
                  <StatusBar backgroundColor={"#D22630"} />
                </SafeAreaView>
              </View>
              <View style={styles.header} {...props}>
                <View style={styles.headerLeft}>
                  {props.navigation.canGoBack() && (
                    <IconButton iconColor={"#FFFFFF"} icon={"arrow-left"} size={28}
                                onPress={() => props.navigation.goBack()} />
                  )}
                  <Text
                    style={{ paddingHorizontal: props.navigation.canGoBack() ? 0 : 10 }}
                    variant={"appHeader"}>
                    {props.route.name}
                  </Text>
                </View>
                {props.route.name === "Home" && (
                  <View>
                    <IconButton iconColor={"#FFFFFF"} icon={"bell"} size={24} onPress={() => {
                    }} />
                  </View>
                )}
              </View>
            </View>
          )
        }}>
        <Stack.Screen
          name={"Home"}
          component={Home}
          initialParams={{
            query: undefined,
            author: undefined,
            before: null,
            after: null,
            season: undefined
          }}
        />
        <Stack.Screen name={"Search"} component={Search} />
        <Stack.Screen name={"Notifications"} component={Notifications} />
        <Stack.Screen name={"Question"} component={Question} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 5,
    paddingVertical: 4,
    backgroundColor: "#D22630"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  statusBar: {
    height: StatusBar.currentHeight,
    backgroundColor: "#D22630"
  }
});
