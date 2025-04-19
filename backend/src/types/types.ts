export interface Group {
  groupName: string;
  groupDescription: string;
  members: Account[];
  owner: Account | undefined;
  isPublic: boolean;
  id: number;
}

export interface Member {
  username: string;
  password: string;
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
  userID: number;
  displayName?: string;
}

export interface Permissions {
  canMessage: boolean;
  canDeleteMessages: boolean;
  admin: boolean;
  createRank: boolean;
}

export interface Database {
  accounts: {
    [username: string]: Account;
  };
  messages?: any;
}
