import express from "express";
import cors from "cors";
import fs, { accessSync } from "fs";
import bcrypt from "bcrypt";
import { Group, Account, Message, Database, Member } from "./types/types";
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

function findAccountsInDatabase(
  database: string,
  item: string
): Account | undefined {
  if (!database || !item) {
    console.error("Args not provided");
    return undefined;
  }
  const itemInDatabase: Database | null = readDatabase(database);

  console.log(itemInDatabase);

  if (itemInDatabase === null) {
    console.error("blah");
    return undefined;
  }

  return itemInDatabase.accounts.find((account) => account.username == item);
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
<<<<<<< HEAD
  console.log(username + "/" + password);
  let account: Account | undefined = findAccountsInDatabase(
    "database/users.json",
    username
=======
  let account: Account | undefined = findInDatabase(
    username,
    "database/users.json"
>>>>>>> f7f68ddc5b1f4bda38cff323a4bebf2a39147862
  );
  // Here
  if (account === undefined) {
    account = {
      username: "none",
      password: "none",
      userID: 0,
    };
    return res.status(200).send("[CHATMANAGER]: None account set");
  }
  let correctToken = checkTokenValid(token);
  if (correctToken) {
    if (account === undefined) {
      return res.status(400).send("Could not find account");
    }
    if (username === "admin.admin" && password === "password") {
      account.username = username;
      account.password = password;
      account.userID = 1;
      return res.status(200).send(account);
    } else {
      return res.status(401).send("Incorrect Username/Password");
    }
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

function getOwnerOfGroup(groupName: string) {
  const owner: Member = {
    username: "",
    displayName: "",
    userID: 0,
  };
  return owner;
}

function sendMessageToGroup(message: Message, group: Group) {}

app.post("/sendmsg", (req: any, res: any) => {
  let sender: string = req.body.sender;
  let message: string = req.body.message;
  let type: string = req.body.type;
  let account = findMemberInDatabase(sender, "database/users");
  if (account && account.displayName === undefined) {
    account.displayName = account.username;
  }
  if (sender !== undefined && message !== undefined && account) {
    let fullMessage = formatMessage(account.displayName, message, 0);
    console.log("[CHATMANAGER/MESSAGE]: " + fullMessage);
    if (type == "group") {
      const testGroup: Group = {
        groupName: "",
        groupDescription: "",
        members: [],
        owner: undefined,
        isPublic: false,
      };
      testGroup.owner = getOwnerOfGroup(testGroup.groupName)
      sendMessageToGroup(fullMessage, testGroup);
    } else {
      let database = readDatabase("database/servers.json");
      if (!database) {
        return res.status(400);
      }
      newMessageInDatabase(database, fullMessage);
      return res.status(200).json(fullMessage);
    }
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
  if (database == null) {
    console.error("Could not find database");
    return false;
  }
  database.["SERVER 1"]["Channel 1"].Settings.serverName = serverName;
  return true;
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

function usernameToMember(username: string): Member | null {
  let database = readDatabase("database/users.json");
  if (!database) {
    console.error("Database not found");
    return null;
  }
  let usernameInDatabase = database.accounts.find(
    (account) => account.username === username
  );
  const member: Member = {
    username: "Name",
    displayName: "name",
    userID: 1,
  };
  return member;
}

function createChat(
  chatName: string,
  chatDes: string,
  chatOwner: Account
): Group | null {
  let exists = activeChats.find(chatName.toString);
  if (exists) {
    console.log("Name allready exists");
    return null;
  } else {
    const newChat: Group = {
      groupName: chatName,
      groupDescription: chatDes,
      members: [],
      owner: chatOwner,
      isPublic: false,
    };
    console.log(newChat);
    return newChat;
  }
}

function getServerMemberUsernames(serverID: number): string {
  let database = readDatabase("database/servers.json");

  let members = {
    Ben: "Ben",
    Admin: "Admin",
  };
  return members.Ben;
}

function getServerData(serverID: number): string | null {
  if (!serverID) {
    console.error("Must provide serverID");
    return null;
  }
  let data = getServerMemberUsernames(serverID);
  return data;
}

app.post("/createChat", (req: any, res: any) => {
  let chatName = req.query["chatName"];
  let chatDescription = req.query["chatDes"];
  let chatOwner = req.query["chatOwner"];
  if (!chatName || !chatDescription || !chatOwner) {
    return res.status(400).send("Chat name or chat description not provided.");
  } else {
    let chat = createChat(
      chatName as string,
      chatDescription as string,
      chatOwner as unknown as Account
    );
    return res.status(200).send(chat);
  }
});
app.get("/getChatID", (req: any, res: any) => {
  const chatID = { id: "1" };
  return res.status(200).send(chatID);
});
app.get("/getChannelMessageServer", (req: any, res: any) => {
  const database = readDatabase("database/servers.json");
  let messages = database?.messages;
  if (messages) {
    return res.status(200).send(messages);
  }
  return res.status(401).send("Could not find messages");
});

app.get("/server", (req: any, res: any) => {
  let serverID = req.query.serverID;
  if (!serverID) {
    return res.status(400).send("Must provide serverID");
  }
  const data = getServerData(serverID);
  return res.status(200).send(data);
});

function addNewAccountToDatabase(databaseName: string, newAccount: Account) {
  if (databaseName == null) {
  }
  const database = readDatabase(databaseName);
  if (database === null) {
    console.error("No Existing Data");
    return;
  }
  database.accounts.push(newAccount);
  writeDatabase(database, databaseName);
}

function findMemberInDatabase(
  username: string,
  databaseName: string
): undefined | Member {
  if (!username) {
    console.error("Username not provided");
    return undefined;
  }
  const database = readDatabase(databaseName);
  console.log(database?.accounts);
  if (!database) {
    return undefined;
  }
  if (database === undefined || database.accounts === undefined) {
    return undefined;
  }
  const accountList: Account[] = database.accounts;
  const account: Account | undefined = database.accounts.find(
    (account: Account) => {
      return account.username == username ? account : undefined;
    }
  );
  let member: Member | undefined = account
    ? {
        username,
        displayName: username,
        userID: account.userID,
      }
    : undefined;
  return member;
}

function newMessageInDatabase(database: Database, newMessage: Message) {
  if (!database) {
    console.error("No Existing Data");
    return;
  }
  database.messages.push(newMessage);
  return database.messages;
}

app.get("/getChatMessages", (req: any, res: any) => {
  let serverID = req.query["serverID"];
  if (serverID == undefined) {
    return res.status(400).send("Must provide server ID");
  }
  const chatMessages = readDatabase("database/servers.json");
  let messages = chatMessages?.messages;
  res.status(200).send(messages);
});

function deleteChat(chatID: number) {
  let servers = "database/servers.json";
}

function getChatMembers(chatID: number) {
  let chatMembers;
  return chatMembers;
}

function openChannel(num: number) {
  if (num === 1) {
    console.log(num);
  } else if (num === 2) {
    console.log(num);
  }
}

app.listen(port, () => {
  console.log(`Mediapp listening on port ${port}.`);
});
