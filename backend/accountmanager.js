import fs from "fs";

class User {
  constructor(username, password, userid) {
    this.username = username;
    this.password = password;
    this.userid = userid;
  }
  getAsJSON() {
    //Returns the account as a JSON
    return {
      username: this.username,
      password: this.password,
      userid: this.userid,
    };
  }
  deleteAccount() {
    delete this;
  }
  changePassword(currentPassword, newPassword) {
    if (currentPassword == this.password) {
      this.password = newPassword;
    }
  }
}

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
    const existing = readDatabase();
    fs.writeFileSync(`${name}_bak.json`, existing);
    fs.writeFileSync(name, JSON.stringify(data));
    console.log("Data saved");
  } catch {
    console.error("Failed to write to database'");
  }
}

function updateDatabase(updateRecord, name, uid) {
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

function getNewUserId() {
  return 1;
}

export function createAccount(username, password) {
  // create account and save it to the JSON file
  const userId = getNewUserId();
  const newUser = new User(username, password, userId);
  const newUserJSON = newUser.getAsJSON();
  writeDatabase(newUserJSON, "database/users.json");
}
