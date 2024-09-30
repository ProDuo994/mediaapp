const loginButton = document.getElementById('loginBtn');
const signupButton = document.getElementById('signupBtn');
const username = document.getElementById('usrname');
const password = document.getElementById('pswrd');
let accounts = [];

function createAccount(username, password) {
  const newAccount = {
    userid: accounts.length + 1,
    username: username,
    password: password,
  };
  accounts.push(newAccount);
  return newAccount;
}

function login(username, password) {
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
  const newAccount = createAccount(username, password);
  console.log("New account created");
}
signupButton.addEventListener('click', (event) => {
  
});
