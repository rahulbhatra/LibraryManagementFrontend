export type User = {
  id?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  dob?: string;
  age?: number;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  username?: string;
  password?: string;
  userType?: 'LIBRARIAN' | 'MEMBER'
};

export type UserKeys = keyof User;