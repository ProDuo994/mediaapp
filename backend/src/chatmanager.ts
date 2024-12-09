import express from "express";
import cors from "cors";
import fs from "fs";
import { Group, Member, Message } from "./types/types";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const port = 3000;
let activeChats: string[] = [];

function checkTokenValid(token: string) {
  if (token) {
    return true;
  }
  return false;
}

app.post("/login", (req, res) => {
  res.status(200).json({
    message: "login on chatmanager",
  });
  let token = req.query["token"];
  if (token === undefined) {
    res.status(400);
  }
  if (checkTokenValid(token as string)) {
    res.status(200);
  } else {
    res.status(401);
  }
});

function sendMessageToGroup(fullJSONMessage: Message) {}

app.post("/sendmsg", (req, res) => {
  let sender = req.body.sender;
  let message = req.body.message;
  console.log(sender);
  if (sender !== undefined && message !== undefined) {
    let FullMessage = formatMessage(sender, message, 0);
    writeDatabase(FullMessage, "database/servers.json");
    console.log("[CHATMANAGER/MESSAGE]: " + FullMessage);
    sendMessageToGroup(FullMessage);
    res.status(200).json(FullMessage);
  } else {
    res.status(400);
  }
});
app.post("/createChat", (req, res) => {
  res.send("Creating Chat");
  createChat();
  res.status(201);
});
app.get("/getChatID", (req, res) => {
  const chatID = { id: "1" };
  res.send(chatID);
});
app.get("/getChannelMessageServer", (req, res) => {
  const chatMessages = readDatabase("database/servers.json");
  res.send(chatMessages);
});

function readDatabase(name: string) {
  try {
    const data = fs.readFileSync(name, "utf8");
    return JSON.parse(data);
  } catch {
    console.error("Could not read database");
    return null;
  }
}

function writeDatabase(data: object, name: string) {
  if (!data) return console.log("No Data found");
  try {
    const existing = readDatabase(name);
    fs.writeFileSync(`${name}_bak.json`, existing);
    fs.writeFileSync(name, JSON.stringify(data));
    console.log("Data saved");
  } catch {
    console.error("Failed to write to database");
  }
}

function updateDatabase(updateRecord: string[], name: string, uid: number) {
  const existingData = readDatabase(name);
  if (!existingData) {
    console.error("No Existing Data");
    return;
  }
  const indexToUpdate = existingData.findIndex(
    (record: string) => record[uid] == updateRecord[uid]
  );

  if (indexToUpdate == -1) {
    console.error("Record not foundation for update");
    return;
  }
  existingData[indexToUpdate] = {
    ...existingData[indexToUpdate],
    ...updateRecord,
  };
}

app.get("/getChatMessages", (req, res) => {
  let serverID = req.query["serverID"];
  if (serverID == undefined) {
    res.status(400);
    return;
  }
  const chatMessages = readDatabase("database/servers.json");
  res.send(chatMessages);
});

function createChat(chatName: string, chatDes: string, chatOwner: Member) {
  let exists = activeChats.find(chatName);
  if (exists) {
    console.log("Name allready exists");
  } else {
    // Add chat to database
    const newChat: Group = {
      groupName: chatName,
      groupDescription: chatDes,
      members: [],
      owner: chatOwner,
      isPublic: false,
    };
    const { database } = JSON.parse(fs.readFileSync("./database.json"));
  }
}

function deleteChat(chatID: number) {
  let servers = "database/servers.json";
}

function getChatMembers(chatID: number) {
  let chatMembers;
  return chatMembers;
}

function openChannel(num: number) {
  if (num == 1) {
    console.log(num);
  } else if (num == 2) {
    console.log(num);
  }
}

function formatMessage(sender: string, message: string, timesent: number) {
  let sendersAccount = sender;
  let messageTime = timesent;
  let fullmessage = sendersAccount + ": " + message;
  const messageObject = {
    myMessage: fullmessage,
  };
  return { myMessage: fullmessage };
  // Tells the server when the message is read
  // Sends HTTP protocal to confirm message sent
}
app.listen(port, () => {
  console.log(`Mediapp listening on port ${port}.`);
});
app.enable("mediapp server"); // enables the server for simpiler defining and naming
