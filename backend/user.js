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
  if (username == "admin.admin" && password == "password") {
    
  }
}

function signup(username, password) {
  const existingAccount = accounts.find(account => account.username == username);
  if (existingAccount) {
    console.log("Username allready exists");
    return;
  }
  const newAccount = createAccount(username, password);
  console.log("New account created");
