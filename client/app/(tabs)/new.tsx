import { getUsers } from "@/utils/apiCalls";
import { SignedIn, useAuth, useClerk } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Users = ({ item }: any) => {
  return (
    <TouchableOpacity
      style={styles.messageContainer}
      onPress={() =>
        router.push(
          `/chat/${item.chatId ? item.chatId : 0}?participantId=${item._id}`
        )
      }
    >
      <Image source={item.imageUrl} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
      <Text style={styles.timeText}>{item.time}</Text>
    </TouchableOpacity>
  );
};
const newChatScreen = () => {
  const { signOut, user } = useClerk();
  const [users, setUsers] = useState([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      const token = (await getToken()) as string;
      setUsers(await getUsers(token));
    };
    fetch();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => <Users item={item} />}
        keyExtractor={(item: any) => item.id}
      />
      <Text style={{ color: "white" }}>new Chat</Text>
    </View>
  );
};

export default newChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  messageContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageContent: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontWeight: "bold",
    color: "white",
  },
  messageText: {
    color: "#555",
  },
  timeText: {
    color: "#888",
    fontSize: 12,
  },
});
