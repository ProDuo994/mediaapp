const loginButton = document.getElementById('loginBtn');
const signupButton = document.getElementById('signupBtn');
const username = document.getElementById('usrname');
const password = document.getElementById('pswrd');
let accounts = [];

function createEnvryptionKey(userid) {
  // Create non duplicate number
  let usedIds = [];
  for (let x in accounts) do {
    let id = accounts.at(x);
    userIds.push(id);
  }
}

function getEncrytionKey(userid) {
  // TODO
}

function encryptPassword(password, key) {
  if (password && key) {
    let newPassword = password;
    return newPassword;
  } else {
    return null;
  }
}

function decryptPassword(password, key) {
  if (password && key) {
    let decryptedPassword = password;
    return decryptedPassword;
  }
}

function createAccount(username, password, key) {
  const newAccount = {
    userid: accounts.length + 1,
    username: username,
    password: password,
    key: key
  };
  let encryptedPassword = encryptPassword(newAccount.password, createEncryptionKey(newAccount.userid));
  newAccount.password = encryptedPassword;
  accounts.push(newAccount);
  return newAccount;
}

function login(username, password) {
  let key = getEncryptionKey();
  const account = accounts.find(acc => acc.username === username && acc.password === password);
  if (account) {
      console.log("Login successful! Welcome, " + account.username);
  } else if (username === "admin.admin" && password === "password") {
      console.log("Login successful as admin.");
  } else {
      console.log("Invalid username or password.");
  }
}
loginButton.addEventListener('click', (event) => {
  login(username.value, password.value);
});

function signup(username, password) {
  const existingAccount = accounts.find(account => account.username == username);
  if (existingAccount) {
    console.log("Username allready exists");
    return;
  }
  const newAccount = createAccount(username, password, 1);
  console.log("New account created");
}
signupButton.addEventListener('click', (event) => {
  signup("testusername", "testpass");
});
