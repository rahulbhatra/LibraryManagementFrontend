import { BearerAccessRefreshToken } from '../../models/authentication';
import { User } from '../../models/user';

const getLocalRefreshToken = (): string => {
  const bartStorage = localStorage.getItem('BearerAccessRefreshToken');
  const bearerAccessRefreshToken: BearerAccessRefreshToken = bartStorage ? JSON.parse(bartStorage) : null;
  // console.log(bearerAccessRefreshToken);
  return bearerAccessRefreshToken?.refresh_token;
};
  
const getLocalAccessToken = (): string => {
  const bartStorage = localStorage.getItem('BearerAccessRefreshToken');
  const bearerAccessRefreshToken: BearerAccessRefreshToken = bartStorage ? JSON.parse(bartStorage) : null;
  return bearerAccessRefreshToken?.access_token;
};
  
const getLocalRoles = (): string[] => {
  const bartStorage = localStorage.getItem('BearerAccessRefreshToken');
  const bearerAccessRefreshToken: BearerAccessRefreshToken = bartStorage ? JSON.parse(bartStorage) : null;
  return bearerAccessRefreshToken?.roles;
};
  
const isMember = (): boolean => {
  const roles = getLocalRoles();
  const member: User['userType'] = 'MEMBER';
  return roles?.includes(member);
};
  
const isLibrarian = (): boolean => {
  const roles = getLocalRoles();
  const librarian: User['userType'] = 'LIBRARIAN';
  return roles?.includes(librarian);
};
  
const updateLocalAccessToken = (token: string) => {
  const bartStorage = localStorage.getItem('BearerAccessRefreshToken');
  let bearerAccessRefreshToken: BearerAccessRefreshToken = bartStorage ? JSON.parse(bartStorage) : null;
  bearerAccessRefreshToken.refresh_token = token;
  localStorage.setItem('bearerAccessRefreshToken', JSON.stringify(bearerAccessRefreshToken));
};
  
const getBearerAccessRefreshToken = (): BearerAccessRefreshToken => {
  const bartStorage = localStorage.getItem('BearerAccessRefreshToken');
  return bartStorage ? JSON.parse(bartStorage) : null;
};
  
const setBearerAccessRefreshToken = (bearerAccessRefreshToken: BearerAccessRefreshToken) => {
  // console.log(JSON.stringify(bearerAccessRefreshToken));
  localStorage.setItem('BearerAccessRefreshToken', JSON.stringify(bearerAccessRefreshToken));
};
  
const removeBearerAccessRefreshToken = () => {
  localStorage.removeItem('BearerAccessRefreshToken');
};
  
const getAuthorization = () => {
  return 'Bearer ' + getLocalAccessToken();
};

const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  getLocalRoles,
  updateLocalAccessToken,
  getBearerAccessRefreshToken,
  setBearerAccessRefreshToken,
  removeBearerAccessRefreshToken,
  getAuthorization,
  isLibrarian,
  isMember
};

export default TokenService;
