import { IContacts, IGroups } from "./IListsComplete";

export interface IDataLogin {
  email: string;
  password: string;
}

export interface IDataRegister {
  email: string;
  password: string;
  name: string;
}

export interface IDataRegContact extends IContacts {
  userEmail: string;
  userAuth: string;
}

export interface IDataRegGroup extends IGroups {
  userEmail: string;
  permission: string;
}

export interface IDataAuth {
  email: string;
}

export interface IDataPrivate {
  from: string;
  to: string;
  content: string;
}

export interface ILog {
  log: any;
  from: string;
  to?: string;
  status?: string;
}