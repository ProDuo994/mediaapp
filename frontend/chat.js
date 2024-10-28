const server = "http://192.168.2.71:3000";
const accountName = "Admin";
const D = new Date();
let time = D.getTime();

function sendMessage(sender, message) {
  fetch(`${server}/sendmsg`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "no-cors",
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
    body: `{sender: ${sender}, message: ${message}}`,
  }).then((res) => {
    console.log(res);
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

function getChatID(name) {
  fetch(`${server}/getChatID`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
  }).then((res) => {
    res.json().then((json) => console.log(json));
  });
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
}

function onWebsiteOpen() {
  let name = "server";
  loadServerData(getChatID(name));
}
onWebsiteOpen();
