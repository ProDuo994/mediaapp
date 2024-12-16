import { User } from "./types/types";
import fs from "fs";

let Users: User[] = [];

function findUserfromName(username: string) {
  for (let i = 0; i < Users.length; i++) {
    if (Users[i]?.username == username) {
      let user = Users[i];
      return user;
    }
  }
  console.error("Could not find account");
}

function readDatabase(name: string) {
  try {
    const data = fs.readFileSync(name, "utf8");
    return JSON.parse(data);
  } catch {
    console.error("Could not read database");
    return null;
  }
}

function writeDatabase(data: string, name: string) {
  if (!data) return console.log("No Data found");
  try {
    const existing = readDatabase(name);
    fs.writeFileSync(`${name}_bak.json`, existing);
    fs.writeFileSync(name, JSON.stringify(data));
    console.log("Data saved");
  } catch {
    console.error("Failed to write to database'");
  }
}

function updateDatabase(updateRecord: any, name: string, uid: number) {
  const existingData = readDatabase(name);
  if (!existingData) {
    console.error("No Existing Data");
    return;
  }
  const indexToUpdate = existingData.findIndex(
    (record: any) => record[uid] == updateRecord[uid]
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

function createAccount(username: string, password: string) {
  // create account and save it to the JSON file
  const userId = getNewUserId();
  const newUser: User = {
    username,
    password,
    UserID: userId,
  };
  writeDatabase(newUser.username, "database/users.json");
}

function deleteAccount(username: string) {
  let account = findUserfromName(username);
  if (account === undefined) {
    console.error("Could not find account");
    return false;
  }
}

function changePassword(
  username: string,
  currentPassword: string,
  newPassword: string
) {
  let account = findUserfromName(username);
  if (account === undefined) {
    console.error("Could not find account");
    return false;
  } else {
    console.error("Failed to change password");
  }
  if (account.password != newPassword && newPassword != currentPassword) {
    account.password = newPassword;
    return true;
  } else {
    console.error("Failed to change password");
  }
}
