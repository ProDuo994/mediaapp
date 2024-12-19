import express from "express";
import cors from "cors";
import fs from "fs";
import { Group, Account, Message, Database } from "./types/types";
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

function findInDatabase(database: string, item: string) {
  if (!database || !item) {
    return console.error("Args not provided");
  }
  let account;
  // TODO: Implement sorting algorithim
  if (
    item.startsWith("a") ||
    item.startsWith("b") ||
    item.startsWith("c") ||
    item.startsWith("d")
  ) {
    return account;
  } else {
  }
}

function checkTokenValid(token: string) {
  if (token !== undefined) {
    return true;
  }
  return false;
}

app.post("/login", (req: any, res: any) => {
  let username = req.query["username"];
  let password = req.query["password"];
  let token = req.query["token"];
  let account = findAccountInDatabase(username, "database/users.json");
  // TODO: Create token logic
  if (!account) {
    return res.status(400);
  }
  if (username === "admin.admin" && password === "password") {
    account.username = username;
    account.displayName = username;
    account.userID = 1;

    return res.status(200).json({ message: "ok" });
  } else {
    console.log(username, password);
  }
});

function formatMessage(
  sender: string,
  message: string,
  timesent: number
): Message {
  return {
    sender,
    message,
    timesent,
  };
}

function writeDatabase(data: object, name: string) {
  if (!data) return console.log("No Data found");
  try {
    const existing: any = readDatabase(name);
    fs.writeFileSync(`${name}_bak.json`, existing);
    fs.writeFileSync(name, JSON.stringify(data));
    console.log("Data saved");
  } catch {
    console.error("Failed to write to database");
    return null;
  }
}

function sendMessageToGroup(message: Message) {}

app.post("/sendmsg", (req: any, res: any) => {
  let sender: string = req.body.sender;
  let message: string = req.body.message;
  let account = findAccountInDatabase(sender, "database/users.json");
  if (account && account.displayName === undefined) {
    account.displayName = account.username;
  }
  if (sender !== undefined && message !== undefined && account) {
    let fullMessage = formatMessage(account.displayName, message, 0);
    console.log("[CHATMANAGER/MESSAGE]: " + fullMessage);
    sendMessageToGroup(fullMessage);
    let database = readDatabase("database/servers.json");
    if (!database) {
      return res.status(400);
    }
    newMessageInDatabase(database, fullMessage);
    return res.status(200).json(fullMessage);
  } else {
    return res.status(400).send("All args not provided");
  }
});

function updateSettings(
  serverName: string,
  serverDes: string,
  isVisible: boolean,
  canMessage: boolean
) {
  let database = readDatabase("database/servers.json");
}

app.post("/updateSettings", (req: any, res: any) => {
  let serverName = req.body.serverName;
  let serverDes = req.body.serverDes;
  let isVisible = req.body.isVisible;
  let canMessage = req.body.canMessage;
  updateSettings(serverName, serverDes, isVisible, canMessage);
  res.status(200);
});

function readDatabase(name: string): Database | null {
  try {
    const data = fs.readFileSync(name, "utf8");
    return JSON.parse(data);
  } catch {
    console.error("Could not read database");
    return null;
  }
}

function usernameToMember(username: string): Account | null {
  let database = readDatabase("database/users.json");
  if (!database) {
    console.error("Database not found");
    return null;
  }
  let usernameInDatabase = database.accounts.find(
    (account) => account.username === username
  );
  const member: Account = {
    username: "Name",
    displayName: "name",
    userID: 1,
  };
  return member;
}

function createChat(chatName: string, chatDes: string, chatOwner: Account) {
  let exists = activeChats.find(chatName.toString);
  if (exists) {
    console.log("Name allready exists");
  } else {
    const newChat: Group = {
      groupName: chatName,
      groupDescription: chatDes,
      members: [],
      owner: chatOwner,
      isPublic: false,
    };
    console.log(newChat);
  }
}

function getServerMemberUsernames(serverID: number) {
  let database = readDatabase("database/servers.json");
  let members: string[] = [];
  return members;
}

function getServerData(serverID: number) {
  if (!serverID) {
    console.error("Must provide serverID");
    return null;
  }
  let data = {
    serverName: "",
    serverMembers: [""],
  };
  data.serverMembers = getServerMemberUsernames(serverID);
  return data;
}

app.post("/createChat", (req: any, res: any) => {
  let chatName = req.query["chatName"];
  let chatDescription = req.query["chatDes"];
  let chatOwner = req.query["chatOwner"];
  if (!chatName || !chatDescription || !chatOwner) {
    return res.status(400).send("Chat name or chat description not provided.");
  } else {
    createChat(
      chatName as string,
      chatDescription as string,
      chatOwner as unknown as Account
    );
    return res.status(200).send("Creating Chat");
  }
});
app.get("/getChatID", (req: any, res: any) => {
  const chatID = { id: "1" };
  return res.status(200).send(chatID);
});
app.get("/getChannelMessageServer", (req: any, res: any) => {
  const chatMessages = readDatabase("database/servers.json");
  return res.status(200).send(chatMessages);
});

app.get("/server", (req: any, res: any) => {
  let serverID = req.query.serverID;
  if (!serverID) {
    res.status(400);
    return;
  }
  const data = getServerData(serverID);
  return res.status(200);
});

function addNewAccountToDatabase(databaseName: string, newAccount: Account) {
  const database: Database = readDatabase(databaseName);
  if (!database) {
    console.error("No Existing Data");
    return;
  }
  database.accounts.push(newAccount);
  writeDatabase(database, databaseName);
}

function findAccountInDatabase(username: string, databaseName: string) {
  if (!username) {
    console.error("Username not provided");
    return null;
  }
  const database = readDatabase(databaseName);
  if (!database) {
    return null;
  }
  const account = database.accounts.find((elem) => elem.username === username);
  return account;
}

function newMessageInDatabase(database: Database, newMessage: Message) {
  if (!database) {
    console.error("No Existing Data");
    return;
  }
  database.messages.push(newMessage);
}

app.get("/getChatMessages", (req: any, res: any) => {
  let serverID = req.query["serverID"];
  if (serverID == undefined) {
    return res.status(400);
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

app.listen(port, () => {
  console.log(`Mediapp listening on port ${port}.`);
});
