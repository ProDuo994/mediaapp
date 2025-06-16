export interface Group {
  groupName: string;
  groupDescription: string;
  members: Profile[];
  owner: Account | undefined;
  isPublic: boolean;
  id: number;
}

export interface Profile {
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
  messages: [
    {
      sender: string;
      message: string;
      timesent: number;
    }
  ];
  servers: {
    [serverName: string]: {
      messages: any;
      serverID: number;
      members: Profile[];
      groups: Group[];
    };
  };
}

export interface Folder {
  files: {};
}
