import { IUser, IUserBanco } from '../interface/IUser';
import { UsersData } from '../assets/data/user';
import { IHash } from '../Provider/interface/hash';
import { HashProvider } from '../Provider/hash';
import { IDataRegContact, IDataRegGroup } from '../interface/IData';
import { v4 as uuid } from 'uuid';

export default class ServiceUser {
  private readonly hashProvider: IHash;

  constructor() {
    this.hashProvider = new HashProvider();
  }

  public createUser = (data: IUser) => {
    if (this.findUserByEmail(data.email)) {
      return {
        error: 'User already exists',
        status: 409,
        message: '',
      };
    }

    if (this.findUserByUsername(data.name)) {
      return {
        error: 'User already exists',
        status: 409,
        message: '',
      };
    }

    const { password, ...user } = data;

    var passwordTemp = this.hashProvider.generate(password);
    UsersData.push({
      id: uuid(),
      ...user,
      password: passwordTemp,
      listContacts: [],
      listGroups: [],
    });

    return {
      status: 200,
      message: `Successfully user created`,
      error: '',
    };
  };

  public updateUser = (user: IUserBanco) => {
    const findUser = this.findUserByEmail(user.email);

    if (!findUser) {
      return {
        status: 404,
        error: `User not found`,
        message: '',
      };
    }

    const indexUser = UsersData.findIndex((item) => item.email === user.email);

    if (indexUser !== -1) {
      UsersData[indexUser] = user;
    }

    return {
      status: 200,
      message: UsersData[indexUser],
      error: '',
    };
  };

  public findUserById = (id: string) => {
    const data = UsersData.filter((user) => user.id === id)[0];

    if (!data) {
      throw new Error(`User with id ${id} not found`);
    }

    return data;
  };

  public findUserByEmail = (email: string) => {
    const data = UsersData.filter((user) => user.email === email)[0];
    return data;
  };

  public findUserByUsername = (name: string) => {
    const data = UsersData.filter((user) => user.name === name)[0];
    return data;
  };

  public saveKey = (user: IUser, key: string, user_email: string) => {
    user.listKeysContact?.push({ key, to: user_email });
  };

  public insertContact = (data: IDataRegContact) => {
    // console.log("data ->", data);
    const user = this.findUserByEmail(data.userAuth);
    // console.log("user ->",user);
    const contact = UsersData.filter(
      (item) => item.email === data.userEmail
    )[0];

    if (!contact) {
      return {
        status: 404,
        error: 'User not found',
        message: '',
      };
    }

    const { userAuth, ...contactNew } = data;
    const currentContact = {
      userEmail: contactNew.userEmail,
      name: contact.name,
      photo: contactNew.photo,
    };
    console.log('insertContact::userB: ', currentContact);

    const hasContact = user.listContacts?.filter(
      (contact) => contact.userEmail === data.userEmail
    )[0];

    if (hasContact) {
      return {
        status: 400,
        error: 'User already has contact',
        message: '',
      };
    }

    const hasKey = user.listKeysContact?.filter(
      (keys) => keys.to === data.userEmail
    )[0];

    if (hasKey) {
      user.listContacts?.push({ ...currentContact });

      return {
        status: 200,
        error: '',
        message: 'User ',
      };
    }

    const keyActive = uuid();

    this.saveKey(user, keyActive, contactNew.userEmail);
    this.saveKey(contact, keyActive, user.email);

    user.listContacts?.push({ ...currentContact });

    return {
      status: 200,
      message: 'Contact save your list',
      error: '',
    };
  };

  public insertGroup = (data: IDataRegGroup) => {
    const user = this.findUserByEmail(data.userEmail);

    return {
      status: 200,
      message: 'Contact save your list',
      error: '',
    };
  };
}
