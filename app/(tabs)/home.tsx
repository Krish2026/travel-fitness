import { Text, View, StyleSheet } from "react-native";
import { theme } from "../../theme";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Travel Fitness</Text>
      <Text style={styles.subtitle}>Your fitness companion on the go</Text>
      <Text style={styles.placeholder}>
        Explore the tabs above to get started
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorWhite,
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colorGreen,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: theme.colorLeafyGreen,
    marginBottom: 24,
    textAlign: "center",
  },
  placeholder: {
    fontSize: 16,
    color: theme.colorGrey,
    textAlign: "center",
  },
});
