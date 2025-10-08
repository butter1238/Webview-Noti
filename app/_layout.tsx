import { Stack } from "expo-router";
import { LogBox } from "react-native";

export default function Layout() {
  LogBox.ignoreAllLogs(true);

  return <Stack />;
}
