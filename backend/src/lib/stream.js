import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.log("error creating stream user", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userId = userId.toString();
    const token = streamClient.createToken(userId);
    return token;
  } catch (error) {
    console.log("error generating stream token", error);
  }
};
