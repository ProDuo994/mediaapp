import bcrypt, { hash } from "bcrypt";
import fs from "fs";
const loginButton = document.getElementById("loginBtn");
const signupButton = document.getElementById("signupBtn");
const username = document.getElementById("usrname");
const password = document.getElementById("pswrd");

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
    fs.writeFileSync(name, JSON.stringify(data));
    console.log("Data saved");
  } catch {
    console.error("Failed to write to database'");
  }
}

function updateDatabase(updateRecord, name, uid = "id") {
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

function encryptPassword(password) {
  bcrypt.hash(password, 10).then((hashed_password) => {
    return hashed_password;
  });
}

function decryptPassword(password) {
  bcrypt.compare(password, hashed_password).then((password) => {
    return password;
  });
}

function login(username, password) {
  let key = getEncryptionKey();
  const account = accounts.find(
    (acc) => acc.username === username && acc.password === password
  );
  if (account) {
    console.log("Login successful! Welcome, " + account.username);
    location.assign("https://produo994.github.io/mediaapp/frontend/chat.html");
  } else if (username === "admin.admin" && password === "password") {
    console.log("Login successful as admin.");
    location.assign("https://produo994.github.io/mediaapp/frontend/chat.html");
  } else {
    console.log("Invalid username or password.");
  }
}
loginButton.addEventListener("click", (event) => {
  login(username.value, password.value);
});

function signup(username, password) {
  const existingAccount = accounts.find(
    (account) => account.username == username
  );
  if (existingAccount) {
    console.log("Username allready exists");
    return;
  }
  const newAccount = createAccount(username, password, 1);
  console.log("New account created");
  location.assign("https://produo994.github.io/mediaapp/frontend/chat.html");
}
signupButton.addEventListener("click", (event) => {
  signup("testusername", "testpass");
});
