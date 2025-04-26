import express, { Request, Response } from "express";
import cors from "cors";
import fs, { accessSync, read } from "fs";
import bcrypt from "bcrypt";
import { Group, Account, Message, Database, Member } from "./types/types";
import { send } from "process";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
const PORT: number = 3000;
let activeChats: string[] = [];
const serverDatabase: string = "database/servers.json";
const usersDatabase: string = "database/users.json";

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

async function writeDatabase(data: object, name: string) {
  if (!data) return console.log("No Data found");
  try {
    const existing: any = await readDatabase(name);
    await fs.promises.writeFile(`${name}_bak.json`, existing);
    await fs.promises.writeFile(name, JSON.stringify(data));
  } catch {
    return console.error("Failed to write to database");
  }
}

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

async function findUsernameByDisplayName(
  displayName: string
): Promise<string | null> {
  const database = await readDatabase(usersDatabase);
  if (!database) {
    console.error("Could not read database");
    return null;
  }
  for (const username in database.accounts) {
    if (database.accounts[username].displayName === displayName) {
      return username;
    }
  }
  return null;
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

app.post("/signup", async (req: Request, res: Response): Promise<any> => {
  let username = req.body.username;
  let password = req.body.password;
  if (username == null || password == null) {
    res.status(400).send("Please add all arguments");
  }
  let account: Account = {
    username,
    password,
    userID: 2,
  };
  await addNewAccountToDatabase(usersDatabase, account);
  return res.status(200).send(account);
});

app.post("/login", async (req: Request, res: Response): Promise<any> => {
  let username = req.body.username;
  let password = req.body.password;
  let account: Account | void | undefined = await findAccountInDatabase(
    usersDatabase,
    username
  );
  if (account === undefined) {
    return res.status(400).send("Could not find account");
  }
  if (password === account.password) {
    console.log(
      username +
        " logged in at " +
        new Date().toLocaleDateString() +
        " " +
        new Date().toLocaleTimeString()
    );
    return res.status(200).send(account);
  } else {
    return res.status(401).send("Incorrect Username/Password");
  }
});

app.post("/addFreind", async (req: Request, res: Response): Promise<any> => {
  let username = req.body.username;
  let friendName = req.body.friendName;
  if (username == null || friendName == null) {
    return res.status(400).send("Please add all arguments");
  }
  const database = await readDatabase(usersDatabase);
  if (database === null) {
    return res.status(404).send("Could not find database");
  }
  let account: Account | void = database.accounts[username];
  if (account === undefined) {
    return res.status(404).send("Could not find account");
  }
  return res.status(200).send(account);
});

app.post("createChannel", async (req: Request, res: Response): Promise<any> => {
  let channelName = req.body.channelName;
  let channelDes = req.body.channelDes;
  let channelOwner = req.body.channelOwner;
  if (channelName == null || channelDes == null || channelOwner == null) {
    return res.status(400).send("Please add all arguments");
  }
  const database = await readDatabase(usersDatabase);
  if (database === null) {
    return res.status(404).send("Could not find database");
  }
  let account: Account | void = database.accounts[channelOwner];
  if (account === undefined) {
    return res.status(404).send("Could not find account");
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

app.post("/sendmsg", async (req: Request, res: Response): Promise<any> => {
  const { sender, message, isGroup } = req.body;
  if (!sender || !message) {
    console.error("All args not provided");
    return res.status(400).send("All args not provided");
  }
  let database = await readDatabase(usersDatabase);
  const username = await findUsernameByDisplayName(sender);
  console.log(database);
  if (!database?.accounts) {
    console.error("Could not find database/chatmanager:136");
    return res.status(404).send("Could not find database");
  }
  const account: Account = binarySearch(
    Object.values(database?.accounts || {}),
    0,
    Object.values(database?.accounts || {}).length,
    username
  );
  if (!account || typeof account !== "object") {
    console.error("ERROR: Could not find account in database/chatmanager:137");
    return res.status(404).send("Could not find account");
  }

  if (!account.displayName) {
    return res.status(400).send("Display name is undefined");
  }

  const fullMessage = formatMessage(account.displayName, message, Date.now());
  console.log("[CHATMANAGER/MESSAGE]: " + fullMessage);

  if (isGroup === true) {
    return res.status(200).send("Group message received");
  } else {
    const database = await readDatabase("database/servers.json");
    if (!database) {
      return res.status(400).send("Could not find database");
    }
    return res.status(200).send("Direct message sent");
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

app.post("/updateSettings", async (req: Request, res: Response) => {
  let serverName = req.body.serverName;
  let serverDes = req.body.serverDes;
  let isVisible = req.body.isVisible;
  let canMessage = req.body.canMessage;
  await updateSettings(serverName, serverDes, isVisible);
  res.status(200).send("Settings updated");
});

async function usernameToMember(username: string): Promise<Member | null> {
  let database = await readDatabase(usersDatabase);
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
  let exists = activeChats.find((name) => name === chatName);
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

app.get("/getChatID", async (req: Request, res: Response): Promise<any> => {
  const database = await readDatabase("database/servers.json");
  const chatID = { id: "1" };
  return res.status(200).send(chatID);
});
app.get(
  "/getChannelMessageServer",
  async (req: Request, res: Response): Promise<any> => {
    const database = await readDatabase("database/servers.json");
    if (!database) {
      return res.status(404).send("Could not find json database");
    }
    let messages = database.messages;
    if (messages) {
      return res.status(200).send(messages);
    }
  }
);

app.get("/server", async (req: Request, res: Response): Promise<any> => {
  const serverID: number = req.query["serverID"];
  if (!serverID) {
    return res.status(400).send("Must provide serverID");
  }
  const serverData = await getServerData(serverID);
  return res.status(200).send(serverData);
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
  await writeDatabase(database, databaseName);
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

app.get("/getChatMessages", async (req: Request, res: any) => {
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
