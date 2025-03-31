import express from "express";
import cors from "cors";
import fs, { accessSync, read } from "fs";
import bcrypt from "bcrypt";
import { Group, Account, Message, Database, Member } from "./types/types";
import { group } from "console";
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
  username: string
): Promise<Account | void> {
  if (!databaseName || !username) {
    console.error("Args not provided");
    return undefined;
  }
  const database: Database | null = await readDatabase(databaseName);
  if (database === null) {
    return console.error("Could not find account");
  }
  return database.accounts[username];
}

app.post("/signup", (req: any, res: any) => {
  let username = req.query.username;
  let password = req.query.password;
  if (username == null || password == null) {
    res.status(400).send("Please add all arguments");
  }
  const database = readDatabase("backend/database/servers.json");
  let account: Account = {
    username,
    password,
    userID: 2,
  };
  return account;
});

app.post("/login", async (req: any, res: any) => {
  let username = req.query.username;
  let password = req.query.password;
  let account: Account | undefined = await findAccountInDatabase(
    "database/users.json",
    username
  );
  if (account === undefined) {
    return res.status(400).send("Could not find account");
  }
  if (password === account.password) {
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
    return console.error("Failed to write to database");
  }
}

function getOwnerOfGroup(groupName: string): Member | null {
  const owner: Member = {
    username: "",
    password: "",
    displayName: "",
    userID: 0,
  };
  if (owner == undefined) {
    return null;
  }
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
    const fullMessage = formatMessage(account.displayName, message, 0);
    console.log("[CHATMANAGER/MESSAGE]: " + fullMessage);
    if (type == "group") {
    } else {
      const database = await readDatabase("database/servers.json");
      if (database == undefined) {
        return res.status();
      }
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
  let groupMembers: Member[] = [];
  let groupToUpdate: Group = {
    groupName: oldServerName,
    groupDescription: serverDes,
    isPublic: isVisible,
    id: 1,
    owner: undefined,
    members: groupMembers,
  };

  return groupToUpdate;
}

app.post("/updateSettings", (req: any, res: any) => {
  let serverName = req.body.serverName;
  let serverDes = req.body.serverDes;
  let isVisible = req.body.isVisible;
  let canMessage = req.body.canMessage;
  updateSettings(serverName, serverDes, isVisible);
  res.status(200).send("Settings updated");
});

async function readDatabase(name: string): Promise<Database | null> {
  try {
    const data = await fs.promises.readFile(name, "utf8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Could not read database");
    console.error(e);
    return null;
  }
}

async function usernameToMember(username: string): Promise<Member | null> {
  let database = await readDatabase("database/users.json");
  if (!database) {
    console.error("Database not found");
    return null;
  }
  let usernameInDatabase = database.accounts[username];
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
): Group | void {
  let exists = activeChats.find(chatName.toString);
  if (exists) {
    return console.log("Name allready exists");
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
  return members.toString();
}

async function getServerData(serverID: number): Promise<string | void> {
  if (!serverID) {
    return console.error("Must provide serverID");
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
  const database = readDatabase("database/servers.json");
  const chatID = { id: "1" };
  return res.status(200).send(chatID);
});
app.get("/getChannelMessageServer", async (req: any, res: any) => {
  const database = await readDatabase("database/servers.json");
  if (!database) {
    return res.status(404).send("Could not find json database");
  }
  let messages = database.messages;
  if (messages) {
    return res.status(200).send(messages);
  }
});

app.get("/server", (req: any, res: any) => {
  let serverID = req.query.serverID;
  if (!serverID) {
    return res.status(400).send("Must provide serverID");
  }
  return res.status(200).send(getServerData(serverID));
});

async function addNewAccountToDatabase(
  databaseName: string,
  newAccount: Account
) {
  if (databaseName == null) {
  }
  const database = await readDatabase(databaseName);
  if (database === null) {
    return console.error("No Existing Data");
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
  const account: Account | undefined = database.accounts[username];
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

app.get("/getChatMessages", async (req: any, res: any) => {
  let serverID = req.query["serverID"];
  if (serverID == undefined) {
    return res.status(400).send("Must provide server ID");
  }
  const database = await readDatabase("database/servers.json");
  if (!database) {
    return res.status(500);
  }
  if (database.messages == undefined) {
    return res.status(404).send("Could not find messages");
  }
  return res.status(200).send(database.messages);
});

app.listen(PORT, () => {
  console.log(`Mediapp listening on port ${PORT}.`);
});
