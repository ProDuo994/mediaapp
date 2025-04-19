const server = "http://192.168.68.115:3000";
const loggedInDisplayName = localStorage.getItem("displayName");

if (!loggedInDisplayName) {
  alert("You're not logged in!");
  window.location.href = "index.html";
}
let currentChatMessages;
const chatMessagesFromServer = {};
let ServerName = "server";
let messageHistory = [];
let lastAmountOfMessages = getLastMesssagesLength();

function getLastMesssagesLength() {
  const amount = messageHistory.length;
  return amount;
}

function getServer(serverID) {
  fetch(
    `${server}/server${new URLSearchParams({
      serverID,
    })}`
  ).then((res) => {
    if (res.ok) {
      res.json().then((json) => {
        //
      });
    }
  });
}

function sendMessage(sender, message, isGroup) {
  return new Promise((resolve, reject) => {
    if (sender === undefined || message === undefined) {
      reject("Must provide all arguments");
      return;
    }
    fetch(`${server}/sendmsg`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender, message, isGroup }),
    })
      .then((res) => {
        if (res.status === 200) {
          resolve(res);
          console.log(res);
          return;
        } else {
          reject("Failed to send message");
          console.warn("Failed to send message");
        }
      })
      .catch((err) => {
        reject(err);
        console.error("Error:", err);
      });
  });
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

async function getChatID(name) {
  const res = await fetch(`${server}/getChatID`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.id;
}

function getMessageFromServer(serverID) {
  const getMessagePromise = new Promise((resolve, reject) => {
    if (serverID == undefined) {
      reject("Must provide serverID");
      return;
    }

    fetch(
      `${server}/getChatMessages?${new URLSearchParams({
        serverID: serverID,
      })}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff",
        },
      }
    )
      .then((res) => {
        console.log(
          `${server}/getChatMessages?${new URLSearchParams({
            serverID: serverID,
          })}`
        );
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
  if (name === undefined) {
    return false;
  }
  fetch(`${server}/getChannelMessageServer`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
  }).then((res) => {
    res.json().then((json) => {
      Object.assign(chatMessagesFromServer, json);
    });
  });
}

function getMessagesFromClient() {
  let messages = {
    Admin: "Hello",
    Admin: "Hi",
  };
  return messages;
}

function updateSettingsEndpoint(serverName, serverDes, isVisible, canMessage) {
  fetch(`${server}/updateSettings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
    body: JSON.stringify({
      serverName,
      serverDes,
      isVisible,
      canMessage,
    }),
  });
}

function createChannel(chatName, channelName) {}

async function pollMessages(serverID) {
  fetch(
    `${server}/getChannelMessageServer?${new URLSearchParams({ serverID })}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
      },
    }
  )
    .then((res) => res.json())
    .then((json) => {
      const serverData = json["SERVER 1"];
      const channelMessages = serverData?.["Channel 1"]?.messages;

      if (!channelMessages || !Array.isArray(channelMessages)) {
        console.warn("No messages found.");
        return;
      }

      if (channelMessages.length > lastAmountOfMessages) {
        for (const message of channelMessages) {
          createAndAppend(
            "p",
            messageViewBox,
            `${message.username}: ${message.message}`
          );
        }
        lastAmountOfMessages = channelMessages.length;
      }
    })
    .catch((err) => {
      console.error("Error fetching messages:", err);
    });
  await getChatID(ServerName).then((chatID) => saveServerData(chatID));
}

const addChannelButton = document.getElementById("channelAdd");
const channelSettingsButton = document.getElementById("channelSettings");
const newChannelDialog = document.getElementById("newChannelDialog");
const newChannelDialogForm = document.getElementById("newChannelDialogForm");
const newChannelCancel = document.getElementById("closeChannelDialog");
const channelSettingsSubmit = document.getElementById("submitSettings");
const channelSettingsClose = document.getElementById("channelSettingsCancel");
const channelSettingsGui = document.getElementById("channelSettingsGUI");
const visibleCheckbox = document.getElementById("visibleCheckbox");
const messageCheckbox = document.getElementById("messageCheckbox");
const channelNameInput = document.getElementById("channelNameBox");
const channelDesInput = document.getElementById("chanelDesBox");
const sendImageButton = document.getElementById("sendImaageButton");
const sendVoiceButton = document.getElementById("sendVoiceButton");
const closeUploadGuiButton = document.getElementById("closeUploadGui");
let channelName = "Test Server";
let channelDes = "Test Description";
let visible = true;
let canMessage = true;

function getOldServerSettings() {
  visibleCheckbox.checked = visible;
  messageCheckbox.checked = canMessage;
  channelNameInput.value = channelName;
  channelDesInput.value = channelDes;
}

function updateSettings() {
  channelName = channelNameInput.value;
  channelDes = channelDesInput.value;
  visible = visibleCheckbox.checked;
  canMessage = messageCheckbox.checked;
  updateSettingsEndpoint(channelName, channelDes, visible, canMessage);
}

sendVoiceButton.addEventListener("click", (event) => {
  console.log("Press");
});

sendImageButton.addEventListener("click", (event) => {
  document.getElementById("uploadImageGUI").showModal();
});

closeUploadGuiButton.addEventListener("click", (event) => {
  document.getElementById("uploadImageGUI").close();
});

channelSettingsButton.addEventListener("click", (event) => {
  channelSettingsGui.showModal();
  getOldServerSettings();
});

addChannelButton.addEventListener("click", (event) => {
  newChannelDialog.showModal();
  createChannel();
});

newChannelCancel.addEventListener("click", (event) => {
  newChannelDialog.close();
});

newChannelDialogForm.addEventListener("submit", (event) => {
  event.preventDefault();
  newChannelDialog.close();
});

channelSettingsGui.addEventListener("submit", (event) => {
  event.preventDefault();
  updateSettings();
  channelSettingsGui.close();
});

channelSettingsClose.addEventListener("click", (event) => {
  event.preventDefault();
  channelSettingsGui.close();
});

sendVoiceButton.addEventListener("click", (event) => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      window.localStream = stream;
      window.localAudio.srcObject = stream;
      window.localAudio.autoplay = true;
    })
    .catch((err) => {
      console.log(err);
    });
});

messageBoxInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const message = messageBoxInput.value;
    messageBoxInput.value = "";
    createAndAppend("h4", messageViewBox, loggedInDisplayName + ": " + message);
    messageHistory.push(message);
    sendMessage(loggedInDisplayName, message, false);
  }
});

function loadServerData(serverID) {
  const database = "../backend/database.json";
  const serverList = document.getElementById("serverList");
  for (let i = 1; i <= 3; i++) {
    createAndAppend("li", serverList, `Server ${i}`);
  }
}

function saveServerData(serverID) {
  let database = "../backend/database.json";
  let currentMessages = getMessagesFromClient();
  database.messages = currentMessages;
}

function addFriend(userID) {
  alert("Sucsessfully added friend!");
  console.log("Friend Added With ID: " + userID);
}

window.onload = () => {
  currentChatMessages = document.getElementById("channelMessages").children;
  loadServerData(getChatID(ServerName));
  const msgReceiveInteval = setInterval(() => pollMessages(0), 3000);
};
