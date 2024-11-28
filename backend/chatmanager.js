import express from "express";
import cors from "cors";
import fs from "fs";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const port = 3000;
let activeChats = [];

app.post("/login", (req, res) => {
  res.status(200).json({
    message: "login on chatmanager",
  });
});

app.post("/sendmsg", (req, res) => {
  let message = sendMessage("sender", "message", "timesent");
  console.log(message);
  res.status(200).json(message);
});

app.post("/createChat", (req, res) => {
  res.send("Hello World!");
  createChat();
});
app.get("/getChatID", (req, res) => {
  const chatID = {
    id: "1",
  };
  res.send(chatID);
});

app.get("/getChannelMessageServer", (req, res) => {
  const chatMessages = readDatabase("database/servers.json");
  res.send(chatMessages);
});

function readDatabase(name) {
  try {
    const data = fs.readFileSync(name, "utf8");
    return JSON.parse(data);
  } catch {
    console.error("Could not read database");
    return null;
  }
}

function writeDatabase(data, name) {
  if (!data) return console.log("No Data found");
  try {
    const existing = readDatabase();
    fs.writeFileSync(`${name}_bak.json`, existing);
    fs.writeFileSync(name, JSON.stringify(data));
    console.log("Data saved");
  } catch {
    console.error("Failed to write to database'");
  }
}

function updateDatabase(updateRecord, name, uid) {
  const existingData = readDatabase(name);
  if (!existingData) {
    console.error("No Existing Data");
    return;
  }
  const indexToUpdate = existingData.findIndex(
    (record) => record[uid] == updateRecord[uid]
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
  let serverID = req.query.serverID;
  if (serverID == undefined) {
    res.status(400);
  }
  const chatMessages = readDatabase("database/servers.json");
  res.send(chatMessages);
});

function createChat(chatName, chatDes, chatOwner) {
  let exists = activeChats.find(chatName);
  if (exists) {
    console.log("Name allready exists");
  } else {
    // Add chat to database
    const { database } = JSON.parse(fs.readFileSync("./database.json"));
  }
}

function deleteChat(chatID) {
  let servers = "database/servers.json";
}

function getChatMembers(chatID) {
  let chatMembers;
  return chatMembers;
}

function openChannel(num) {
  if (num == 1) {
    console.log(num);
  } else if (num == 2) {
    console.log(num);
  }
}

function sendMessage(sender, message, timesent) {
  let sendersAccount = sender;
  let messageTime = timesent;
  let fullmessage = sendersAccount + ": " + message;
  return { message: fullmessage };
  // Tells the server when the message is read
  // Sends HTTP protocal to confirm message sent
}

app.listen(port, () => {
  console.log(
    `Mediapp listening on port ${port}.`
  );
});
app.enable('mediapp server'); // enables the server for simpiler defining and naming