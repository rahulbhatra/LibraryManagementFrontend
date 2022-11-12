import { BearerAccessRefreshToken } from '../../models/authentication';

const getLocalRefreshToken = (): string => {
  const bartStorage = localStorage.getItem('BearerAccessRefreshToken');
  const bearerAccessRefreshToken: BearerAccessRefreshToken = bartStorage ? JSON.parse(bartStorage) : null;
  console.log(bearerAccessRefreshToken);
  return bearerAccessRefreshToken?.refresh_token;
};

const getLocalAccessToken = (): string => {
  const bartStorage = localStorage.getItem('BearerAccessRefreshToken');
  const bearerAccessRefreshToken: BearerAccessRefreshToken = bartStorage ? JSON.parse(bartStorage) : null;
  return bearerAccessRefreshToken?.access_token;
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
