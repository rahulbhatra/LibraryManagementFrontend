import { BearerAccessRefreshToken } from '../../models/authentication';

const getLocalRefreshToken = (): BearerAccessRefreshToken => {
  const bartStorage = localStorage.getItem('BearerAccessRefreshToken');
  const bearerAccessRefreshToken = bartStorage ? JSON.parse(bartStorage) : null;
  return bearerAccessRefreshToken?.refreshToken;
};

const getLocalAccessToken = (): BearerAccessRefreshToken => {
  const bartStorage = localStorage.getItem('BearerAccessRefreshToken');
  const bearerAccessRefreshToken = bartStorage ? JSON.parse(bartStorage) : null;
  return bearerAccessRefreshToken?.accessToken;
};

const updateLocalAccessToken = (token: string) => {
  const bartStorage = localStorage.getItem('BearerAccessRefreshToken');
  let bearerAccessRefreshToken: BearerAccessRefreshToken = bartStorage ? JSON.parse(bartStorage) : null;
  bearerAccessRefreshToken.accessToken = token;
  localStorage.setItem('bearerAccessRefreshToken', JSON.stringify(bearerAccessRefreshToken));
};

const getBearerAccessRefreshToken = (): BearerAccessRefreshToken => {
  const bartStorage = localStorage.getItem('BearerAccessRefreshToken');
  return bartStorage ? JSON.parse(bartStorage) : null;
};

const setBearerAccessRefreshToken = (bearerAccessRefreshToken: BearerAccessRefreshToken) => {
  console.log(JSON.stringify(bearerAccessRefreshToken));
  localStorage.setItem('BearerAccessRefreshToken', JSON.stringify(bearerAccessRefreshToken));
};

const removeBearerAccessRefreshToken = () => {
  localStorage.removeItem('BearerAccessRefreshToken');
};

const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  updateLocalAccessToken,
  getBearerAccessRefreshToken,
  setBearerAccessRefreshToken,
  removeBearerAccessRefreshToken,
};

export default TokenService;
