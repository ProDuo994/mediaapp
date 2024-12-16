const server = "http://192.168.2.71:3000";

function processLogin(loginInfo, username, password) {
  if (username == "admin.admin" && password == "password") {
    window.location.href = "chat.html";
  } else {
    window.alert("Username or Password incorrect!");
  }
}

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

function enryptPassword(password) {
  if (password != null) {
    password = password;
    return password;
  } else {
    console.warn("Password not provided");
  }
}

function decryptPassword(password) {
  if (password != null) {
    password = password;
    return password;
  } else {
    console.warn("Password not provided");
  }
}
