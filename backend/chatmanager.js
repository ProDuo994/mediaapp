import express from "express";
import cors from "cors";
import fs from "fs";
const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;
let activeChats = [];

app.post("/login", (req, res) => {
  res.status(200).json({
    message: "login on chatmanager",
  });
});

app.post("/sendmsg", (req, res) => {
  let message = sendMessage("sender", "message", "timesent");
  res.status(200).send(message);
});

app.post("/createChat", (req, res) => {
  res.send("Hello World!");
  createChat();
});
app.get("/getChatID", (req, res) => {
  const chatID = {
    id: "abc",
  };
  res.send(JSON.stringify(chatID));
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

function deleteChat() {}

function getChatMembers(chatName) {
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
  //Send the message under the sender's account
  let fullmessage = sendersAccount + ": " + message;
  return fullmessage;
  // Tells the server when the message is read
  // Sends HTTP protocal to confirm message sent
}

app.listen(port, () => {
  console.log(`Mediapp listening on port ${port}`);
});
