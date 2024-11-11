const server = "http://192.168.2.71:3000";
const accountName = "Admin";
const D = new Date();
let time = D.getTime();

function sendMessage(sender, message) {
  fetch(`${server}/sendmsg`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sender, message }),
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

function pollMessages() {
  // tracking current messages
  // then getMessages
  // current messages to retrieved messages
  const savedMessages = getMessageFromServer(0)
    .then((res) => {
      for (const message of res) {
        createAndAppend(
          "p",
          messageViewBox,
          message.username + ": " + message.message
        );
      }
    })
    .catch((err) => {
      console.error(err);
    });
  // Save messages in current chat to server
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

let name = "server";
loadServerData(getChatID(name));
const msgReceiveInteval = setInterval(pollMessages, 3000);
