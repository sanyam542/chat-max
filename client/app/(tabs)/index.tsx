import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import avatar from "@/assets/images/avatar.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import axios from "axios";
import { getChats, getUsers } from "@/utils/apiCalls";
import { useAuth } from "@clerk/clerk-expo";

const messages = [
  {
    id: "1",
    user: "Sanyam",
    message: "✔ Photo",
    time: "5:32 PM",
    avatar, // Replace with actual path
  },
  {
    id: "2",
    user: "Sarthak Sharma (Ssipmt)",
    message: "✔ Back clear kiya ki chhod diya?",
    time: "4:55 PM",
    avatar,
  },
  {
    id: "1",
    user: "Sanyam",
    message: "✔ Photo",
    time: "5:32 PM",
    // avatar: require("./path/to/avatar1.png"), // Replace with actual path
  },
  {
    id: "2",
    user: "Sarthak Sharma (Ssipmt)",
    message: "✔ Back clear kiya ki chhod diya?",
    time: "4:55 PM",
    // avatar: require("./path/to/avatar2.png"), // Replace with actual path
  },
  {
    id: "1",
    user: "Sanyam",
    message: "✔ Photo",
    time: "5:32 PM",
    // avatar: require("./path/to/avatar1.png"), // Replace with actual path
  },
  {
    id: "2",
    user: "Sarthak Sharma (Ssipmt)",
    message: "✔ Back clear kiya ki chhod diya?",
    time: "4:55 PM",
    avatar,
  },
  // Add more messages as needed
];

const MessageItem = ({ item }: { item: (typeof messages)[0] }) => (
  <TouchableOpacity
    style={styles.messageContainer}
    onPress={() => router.push(`/chat/${undefined}`)}
  >
    <Image source={item.avatar} style={styles.avatar} />
    <View style={styles.messageContent}>
      <Text style={styles.userName}>{item.user}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
    <Text style={styles.timeText}>{item.time}</Text>
  </TouchableOpacity>
);
const Chats = ({ item }: any) => {
  return (
    <TouchableOpacity
      style={styles.messageContainer}
      onPress={() => router.push(`/chat/${item._id}`)}
    >
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
      <Text style={styles.timeText}>{item.time}</Text>
    </TouchableOpacity>
  );
};
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

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      const token = (await getToken()) as string;
      setUsers(await getUsers(token));
      setChats(await getChats(token));
    };
    fetch();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => <Users item={item} />}
        keyExtractor={(item: any) => item.id}
      />
      <FlatList
        data={chats}
        renderItem={({ item }) => <Chats item={item} />}
        keyExtractor={(item: any) => item.id}
      />
      <TouchableOpacity
        onPress={() => {
          const fetch = async () => {
            const token = (await getToken()) as string;
            setUsers(await getUsers(token));
            setChats(await getChats(token));
          };
          fetch();
        }}
      >
        {" "}
        <Text style={{ color: "white" }}>Make Request</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
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

export default HomeScreen;
