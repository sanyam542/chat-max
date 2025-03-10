import axios from "axios";

export const getUsers = async (token: string) => {
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_SEVER_URL!}/api/users/search`,
      {
        params: { q: "" },
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token
        },
      }
    );

    return response.data.users;
  } catch (error: any) {
    console.error(
      "Error fetching data:",
      error.response?.data || error.message
    );
  }
};

export const getChats = async (token: string) => {
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_SEVER_URL}/api/chats/`,
      {
        // params: { q: "" },
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token
        },
      }
    );

    return response.data.chats;
  } catch (error) {
    console.log(error);
  }
};

export const createChat = async (
  name: string,
  participants: [string | undefined],
  token: string
) => {
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_SEVER_URL}/api/chats/`,
      {
        name,
        participants: [...participants],
      },
      {
        params: { q: "" },
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token
        },
      }
    );

    console.log(response.data);
    return response.data.chat;
  } catch (error) {
    console.log(error);
  }
};

export const getMessages = async (chatId: string, token: string) => {
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_SEVER_URL}/api/messages/${chatId}`,

      {
        // params: { chatId },
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token
        },
      }
    );

    console.log(response.data.messages);
    return response.data.messages;
  } catch (error) {
    console.log(error);
  }
};

export const sendMessage = async (
  text: string,
  chatId: string | undefined,
  token: string
) => {
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_SEVER_URL}/api/messages/`,
      {
        text: text,
        chatId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token
        },
      }
    );

    console.log(response.data);
    return;
  } catch (error) {
    console.log(error);
  }
};
