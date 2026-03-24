import { Text, View, StyleSheet } from "react-native";
import { theme } from "../../theme";

export default function TrainersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Trainers Screen</Text>
      <Text style={styles.placeholder}>Trainers functionality coming soon</Text>
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
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colorLeafyGreen,
    marginBottom: 12,
  },
  placeholder: {
    fontSize: 16,
    color: theme.colorGrey,
    textAlign: "center",
  },
});
