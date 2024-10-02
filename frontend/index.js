let server = "http://192.168.2.68:3000";

function login(username, password) {
  fetch(`${server}/login`, {
    // Send server packet
    method: "POST", // HTTP protocal being used
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
    body: JSON.stringify({
      //Info sent to server
      username,
      password,
    }),
  })
    .then((res) =>
      res.json().then((json_res) => {
        processLogin(json_res, username, password);
      })
    ) // waits for response then prints to log
    .catch((err) => console.error(err));
}

function processLogin(loginInfo, username, password) {
  console.log(loginInfo);
  if (username == "admin.admin" && password == "password") {
    window.location.href = "http://127.0.0.1:5500/frontend/chat.html";
  } else {
    console.log("nuh uh");
  }
}

function sendMessage(sender, message) {
  fetch(`${server}/sendmsg`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
    body: JSON.stringify({
      sender,
      message,
    }),
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

function openServerMenu() {
  document.getElementById("severMenu").style.visibility = "visible";
}
document.getElementById("menuIcon").addEventListener("click", () => {
  openServerMenu();
});
