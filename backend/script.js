const account = {
    userid: null,
    username: null,
    password: null,
};

let currentId = 1;

function createAccount(username, password) {
    let newAccount = Object.assign({}, account);
    newAccount.userid = currentId++; 
    newAccount.username = username;
    newAccount.password = password;
    return newAccount; 
}

// Example usage:
const account1 = createAccount('user1', 'pass123');