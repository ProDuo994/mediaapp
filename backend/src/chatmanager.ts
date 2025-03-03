import express from "express";
import cors from "cors";
import fs, { accessSync } from "fs";
import bcrypt from "bcrypt";
import { Group, Account, Message, Database, Member } from "./types/types";
import { isNull } from "util";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
const PORT = 3000;
let activeChats: string[] = [];

function binarySearch<Sortable>(
  arr: Sortable[],
  low: number,
  high: number,
  toFind: Sortable
) {
  if (high >= low) {
    let mid = low + Math.floor((high - low) / 2);
    if (arr[mid] == toFind) return mid;
    if (arr[mid] > toFind) return binarySearch(arr, low, mid - 1, toFind);
    return binarySearch(arr, mid + 1, high, toFind);
  }
  return -1;
}

async function findAccountInDatabase(
  databaseName: string,
  item: string
): Promise<Account | undefined> {
  if (!databaseName || !item) {
    console.error("Args not provided");
    return undefined;
  }

  const database: Database | null = await readDatabase(databaseName);
  if (database === null) {
    console.error("Could not find account");
    return undefined;
  }
  console.log(database);
  return database.accounts.find((account) => account.username == item);
}

app.post("/login", async (req: any, res: any) => {
  let username = req.query.username;
  let password = req.query.password;
  console.log(username + "/" + password);
  let account: Account | undefined = await findAccountInDatabase(
    "database/users.json",
    username
  );
  if (account === undefined) {
    account = {
      username: "none",
      password: "none",
      userID: 0,
    };
    return res.status(200).send("[CHATMANAGER]: None account set");
  }
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

async function writeDatabase(data: object, name: string) {
  if (!data) return console.log("No Data found");
  try {
    const existing: any = await readDatabase(name);
    fs.promises.writeFile(`${name}_bak.json`, existing);
    fs.promises.writeFile(name, JSON.stringify(data));
  } catch {
    console.error("Failed to write to database");
    return Error;
  }
}

function getOwnerOfGroup(groupName: string) {
  const owner: Member = {
    username: "",
    password: "",
    displayName: "",
    userID: 0,
  };
  return owner;
}

app.post("/sendmsg", async (req: any, res: any) => {
  let sender: string = req.body.sender;
  let message: string = req.body.message;
  let type: string = req.body.type;
  let account = await findMemberInDatabase(sender, "database/users");
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
        id: 0,
      };
      testGroup.owner = getOwnerOfGroup(testGroup.groupName);
    } else {
      let database = await readDatabase("database/servers.json");
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

async function updateSettings(
  oldServerName: string,
  serverDes: string,
  isVisible: boolean
) {
  let database = await readDatabase("database/servers.json");
  if (database == undefined) {
    console.error("Could not find database");
    return false;
  }
  // database.groups is sorted
  let groupToUpdate: Group | undefined = undefined;
  return groupToUpdate;
}

app.post("/updateSettings", (req: any, res: any) => {
  let serverName = req.body.serverName;
  let serverDes = req.body.serverDes;
  let isVisible = req.body.isVisible;
  let canMessage = req.body.canMessage;
  updateSettings(serverName, serverDes, isVisible);
  res.status(200);
});

async function readDatabase(name: string): Promise<Database | null> {
  try {
    const data = await fs.promises.readFile(name, "utf8");
    return JSON.parse(data);
  } catch {
    console.error("Could not read database");
    return null;
  }
}

async function usernameToMember(username: string): Promise<Member | null> {
  let database = await readDatabase("database/users.json");
  if (!database) {
    console.error("Database not found");
    return null;
  }
  let usernameInDatabase = database.accounts.find(
    (account: { username: string }) => account.username === username
  );
  if (usernameInDatabase == undefined) {
    return null;
  }
  const member: Member = {
    username: "Name",
    displayName: "name",
    userID: 1,
    password: usernameInDatabase.password,
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
      id: 0,
    };
    return newChat;
  }
}

async function getServerMemberUsernames(serverID: number): Promise<string> {
  let database = await readDatabase("database/servers.json");

  let members = {
    Ben: "Ben",
    Admin: "Admin",
  };
  return members.Ben;
}

async function getServerData(serverID: number): Promise<string | null> {
  if (!serverID) {
    console.error("Must provide serverID");
    return null;
  }
  let data = await getServerMemberUsernames(serverID);
  return data;
}

app.post("/createChat", (req: any, res: any) => {
  let chatName = req.query["chatName"];
  let chatDescription = req.query["chatDes"];
  let chatOwner = req.query["chatOwner"];
  if (!chatName || !chatDescription || !chatOwner) {
    return res.status(400).send("Chat name or chat description not provided.");
  }
  let chat = createChat(
    chatName as string,
    chatDescription as string,
    chatOwner as unknown as Account
  );
  return res.status(200).send(chat);
});

app.get("/getChatID", (req: any, res: any) => {
  const chatID = { id: "1" };
  return res.status(200).send(chatID);
});
app.get("/getChannelMessageServer", async (req: any, res: any) => {
  const database = await readDatabase("database/servers.json");
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

async function addNewAccountToDatabase(
  databaseName: string,
  newAccount: Account
) {
  if (databaseName == null) {
  }
  const database = await readDatabase(databaseName);
  if (database === null) {
    console.error("No Existing Data");
    return;
  }
  database.accounts.push(newAccount);
  writeDatabase(database, databaseName);
}

async function findMemberInDatabase(
  username: string,
  databaseName: string
): Promise<Member | undefined> {
  if (!username) {
    console.error("Username not provided");
    return undefined;
  }
  const database = await readDatabase(databaseName);
  if (database == undefined || database.accounts === undefined) {
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
        password: account.password,
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

app.get("/getChatMessages", async (req: any, res: any) => {
  let serverID = req.query["serverID"];
  if (serverID == undefined) {
    return res.status(400).send("Must provide server ID");
  }
  const chatMessages = await readDatabase("database/servers.json");
  if (chatMessages == undefined) {
    return res.status(401).send("Could not find messages");
  }
  let messages = chatMessages.messages;
  res.status(200).send(messages);
});

app.listen(PORT, () => {
  console.log(`Mediapp listening on port ${PORT}.`);
});
