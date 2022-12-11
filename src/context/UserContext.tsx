import React, { Dispatch } from 'react';
import { createContext } from 'react';
import { BearerAccessRefreshToken } from '../models/authentication';

interface InterfaceUserContext {
  token: BearerAccessRefreshToken;
  setToken?: React.Dispatch<React.SetStateAction<BearerAccessRefreshToken>>;
}

const UserContext = createContext<InterfaceUserContext>({ token: {} });

export const UserProvider = UserContext.Provider;

export default UserContext;