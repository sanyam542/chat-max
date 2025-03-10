import { createChat, getMessages, sendMessage } from "@/utils/apiCalls";
import { useAuth, useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";

type Message = {
  id: string;
  text: string;
  time: string;
  isMe: boolean;
  delivered?: boolean;
  date?: string;
};

// const messages: Message[] = [
//   {
//     id: "1",
//     text: "Abe iska matlab kya hota h",
//     time: "4:29 PM",
//     isMe: true,
//     delivered: true,
//     date: "Today",
//   },
//   {
//     id: "2",
//     text: "Pata ni re kuch bhi ho skta -\n2 applicants\n2 ki requirement\nClick krke dekh",
//     time: "4:40 PM",
//     isMe: false,
//   },
//   {
//     id: "3",
//     text: "Ha abhi hora click",
//     time: "4:47 PM",
//     isMe: true,
//     delivered: true,
//   },
//   {
//     id: "4",
//     text: "Badhiya h jao vai interview dene",
//     time: "2:23 AM",
//     isMe: false,
//     date: "Fri, 31 Jan",
//   },
//   { id: "5", text: "Best of luck", time: "2:23 AM", isMe: false },
//   { id: "6", text: "👍", time: "7:59 AM", isMe: true, delivered: true },
//   {
//     id: "7",
//     text: "Chupati chalte ek aat din",
//     time: "12:49 PM",
//     isMe: true,
//     delivered: true,
//     date: "Today",
//   },
//   { id: "8", text: "chl ske", time: "1:10 PM", isMe: false },
//   { id: "9", text: "Saturday", time: "1:11 PM", isMe: false },
// ];

const transformMessages = (messages: any, userId: string) => {
  return messages?.map((message: any, index: number) => {
    const date = new Date(message.timestamp);
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const messageDate = date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    return {
      id: message._id,
      text: message.text,
      time: time,
      isMe: message.senderId === userId,
      delivered: message.senderId === userId, // Assuming messages sent by the user are delivered
      date:
        index === 0 ||
        new Date(messages[index - 1].timestamp).toDateString() !==
          date.toDateString()
          ? messageDate
          : undefined,
    };
  });
};
type MessageBubbleProps = {
  text: string;
  time: string;
  isMe: boolean;
  delivered?: boolean;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  time,
  isMe,
  delivered,
}) => (
  <View
    style={{
      alignSelf: isMe ? "flex-end" : "flex-start",
      backgroundColor: isMe ? "#0084ff" : "#3a3a3a",
      padding: 10,
      borderRadius: 8,
      marginVertical: 4,
      maxWidth: "80%",
    }}
  >
    <Text style={{ color: "white" }}>{text}</Text>
    <Text style={{ color: "#ddd", fontSize: 10, alignSelf: "flex-end" }}>
      {time} {isMe && delivered ? "✔✔" : ""}
    </Text>
  </View>
);

type DateSeparatorProps = {
  date: string;
};

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => (
  <View style={{ alignSelf: "center", paddingVertical: 5 }}>
    <Text style={{ color: "#aaa", fontSize: 12 }}>{date}</Text>
  </View>
);

const ChatScreen: React.FC = () => {
  const { id, participantId } = useLocalSearchParams<{
    id: string;
    participantId?: string;
  }>();
  console.log(id, participantId, "this re bachu");
  const [text, setText] = useState<string>("");
  const [chatId, setChatId] = useState<string>("");
  const [messages, setMessages] = useState([]);

  const { getToken } = useAuth();
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;

  useEffect(() => {
    if (chatId) {
      const fetch = async () => {
        const token = (await getToken()) as string;
        setMessages(await getMessages(chatId, token));
      };
      fetch();
    }
    console.log(user?.publicMetadata, "herre"); // Access public metadata
  }, [chatId]);

  useEffect(() => {
    setChatId(id);
  }, [id]);

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#121212" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "white", fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={transformMessages(messages, userId)}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <>
            {item.date &&
            (index === 0 || messages[index - 1].date !== item.date) ? (
              <DateSeparator date={item.date} />
            ) : null}
            <MessageBubble {...item} />
          </>
        )}
      />
      <View
        style={{ flexDirection: "row", padding: 10, backgroundColor: "#222" }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: "#333",
            color: "white",
            padding: 10,
            borderRadius: 5,
          }}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          onChangeText={setText}
          value={text}
        />
        <TouchableOpacity
          style={{
            marginLeft: 10,
            padding: 10,
            backgroundColor: "#0084ff",
            borderRadius: 5,
          }}
          onPress={async () => {
            const token = (await getToken()) as string;
            console.log("yes1");

            if (chatId == "0") {
              console.log("yes2");

              const chat = await createChat("username", [participantId], token);
              setChatId(chat._id);
              await sendMessage(text, chat._id, token);
            } else {
              await sendMessage(text, chatId, token);
            }
          }}
        >
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
