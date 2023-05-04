import { StyleSheet, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Text } from "./Text";


interface IconLabelProps {
  icon: string;
  label: string;
}

export function IconLabel(props: IconLabelProps) {
  return (
    <View style={styles.iconLabel}>
      <Icon name={props.icon} size={20} color="#535353" />
      <Text numberOfLines={1} variant={"light"}>{props.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconLabel: {
    flexDirection: "row",
    columnGap: 5,
    alignItems: "center"
  }
});
