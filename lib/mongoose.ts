import { set, connect } from "mongoose";

const { MONGODB_URL } = process.env;

let isConnected = false;

const connectToDB = async () => {
  set("strictQuery", true);

  if (!MONGODB_URL) return console.log("MONGODB_URL not found!");
  if (isConnected) return console.log("Already connected to DB!");

  try {
    await connect(MONGODB_URL, {
      dbName: "thread",
    });

    isConnected = true;
    console.log("Connected to DB!");
  } catch (error) {
    console.error(error);
  }
};

export default connectToDB;
