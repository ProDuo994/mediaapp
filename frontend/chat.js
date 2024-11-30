const server = "http://10.221.192.210:3000";
const accountName = "Admin";
const D = new Date();
let time = D.getTime();
let lastAmountOfMessages = -1;
const currentChatMessages = document.getElementById("channelMessages");
const chatMessagesFromServer = "";
let ServerName = "server";

function sendMessage(sender, message) {
  const getMessagePromise = new Promise((resolve, reject) => {
    if (sender == undefined || message == undefined) {
      reject("Must provide all arguments");
      return;
    }
  })
  fetch(`${server}/sendmsg?${new URLSearchParams({
    sender: sender,
    messgae: message
  }).toString()} `, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sender, message }),
  }).then((res) => {
    console.log(res);
  });
  return getMessagePromise;
}

function createChat(name, des) {
  fetch(`${server}/createchat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
    body: JSON.stringify({
      name,
      des,
    }),
  });
}

function getChatID(name) {
  fetch(`${server}/getChatID`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
  }).then((res) => {
    res.json().then((json) => {
      let chatID = json;
      return chatID;
    });
  });
}

function getMessageFromServer(serverID) {
  const getMessagePromise = new Promise((resolve, reject) => {
    if (serverID == undefined) {
      reject("Must provide serverID");
      return;
    }

    fetch(
      `${server}/getChatMessages?${new URLSearchParams({
        serverID: 0,
      }).toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff",
        },
      }
    )
      .then((res) => {
        res
          .json()
          .then((json) => resolve(json))
          .catch((err) => {
            return reject(err);
          });
      })
      .catch((err) => {
        return reject(err);
      });
  });
  return getMessagePromise;
}

function getChannelMessageServer(name) {
  fetch(`${server}/getChannelMessageServer`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
  }).then((res) => {
    res.json().then((json) => (chatMessagesFromServer = res));
  });
}

function getMessagesFromClient() {
  let messages = {
    "Admin": "Hello"
  }
  return messages;
}

function pollMessages() {
  const savedMessages = getMessageFromServer(0)
    .then((res) => {
      const server1 = res["SERVER 1"];
      const channel1Messages = server1["Channel 1"].messages;
      if (channel1Messages.length > lastAmountOfMessages) {
        for (const message of channel1Messages) {
          createAndAppend(
            "p",
            messageViewBox,
            message.username + ": " + message.message
          );
        }
        lastAmountOfMessages = channel1Messages.length;
      }
    })
    .catch((err) => {
      console.error(err);
    });
  // Save messages in current chat to server
  saveServerData(getChatID(ServerName));
}

messageBoxInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const message = messageBoxInput.value;
    messageBoxInput.value = "";
    createAndAppend("p", messageViewBox, accountName + ": " + message);
    messageHistory.push(message);
    sendMessage(accountName, message, time);
  }
});

function loadServerData(serverID) {
  let database = "../backend/database.json";
}

function saveServerData(serverID) {
  let database = "../backend/database.json";
  let currentMessages = getMessagesFromClient();
}

function addFreind(UserID) {
  console.log("Freind Added With ID: " + UserID)
}

loadServerData(getChatID(ServerName));
const msgReceiveInteval = setInterval(pollMessages, 3000);