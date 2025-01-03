export interface Group {
  groupName: string;
  groupDescription: string;
  members: Account[];
  owner: Account;
  isPublic: boolean;
}

export interface Member {
  username: string;
  displayName: string;
  userID: number;
}

export interface Message {
  sender: string;
  message: string;
  timesent: number;
}

export interface Account {
  username: string;
  password: string;
  UserID: number;
}

export interface Permissions {
  canMessage: boolean;
  canDeleteMessages: boolean;
  admin: boolean;
  createRank: boolean;
}

export interface Database {
  accounts: Account[];
  messages: Message[];
}
