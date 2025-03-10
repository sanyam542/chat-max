import { SignedIn, useClerk } from "@clerk/clerk-expo";
import { Button, StyleSheet, Text, View } from "react-native";

const SettingsScreen = () => {
  const { signOut, user } = useClerk();

  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>new Chat</Text>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
