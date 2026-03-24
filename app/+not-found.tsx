import { Stack, Redirect } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Redirect href="/home" />
    </>
  );
}
