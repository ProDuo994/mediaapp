import express from "express";
import cors from "cors";
import fs from "fs";
import { Group, Member, Message, Database } from "./types/types";
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

function sendMessageToGroup(fullJSONMessage: string) {}

app.post("/sendmsg", (req, res) => {
  let sender = req.body.sender;
  let message = req.body.message;
  console.log(sender);
  if (sender !== undefined && message !== undefined) {
    let FullMessage = formatMessage(sender, message, 0);
    writeDatabase(FullMessage, "database/servers.json");
    console.log("[CHATMANAGER/MESSAGE]: " + FullMessage);
    sendMessageToGroup(FullMessage.myMessage);
    res.status(200).json(FullMessage);
  } else {
    res.status(400);
  }
});

function usernameToMember(username: string): Member {
  // TODO: Find username
  let database = readDatabase('database/users.json');
  let usernameInDatabase = database.members.find();
  const member:Member = {
    username: usernameInDatabase,
    displayName: ,
    userID: 
  };
  return member
}

function createChat(chatName: string, chatDes: string, chatOwner: Member) {
  let exists = activeChats.find(chatName.toString);
  if (exists) {
    console.log("Name allready exists");
  } else 
    const newChat: Group = {
      groupName: chatName,
      groupDescription: chatDes,
      members: [],
      owner: chatOwner,
      isPublic: false,
    };
}

app.post("/createChat", (req, res) => {
  let chatName = req.query["chatName"];
  let chatDescription = req.query["chatDes"];
  let chatOwner = req.query["chatOwner"];

  if (!chatName || !chatDescription || !chatOwner) {
    res.status(400).send("Chat name or chat description not provided.");
  } else {
    createChat(
      chatName as string,
      chatDescription as string,
      chatOwner as unknown as Member
    );
    res.send("Creating Chat");
    res.status(201);
  }
});
app.get("/getChatID", (req, res) => {
  const chatID = { id: "1" };
  res.send(chatID);
});
app.get("/getChannelMessageServer", (req, res) => {
  const chatMessages = readDatabase("database/servers.json");
  res.send(chatMessages);
});

function readDatabase(name: string): Database {
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
