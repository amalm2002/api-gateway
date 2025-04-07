export interface Message {
  message: string

}

export interface AuthResponse {
  message: string;
  name: string;
  isOnline: boolean;
  isAdmin: boolean;
  refreshToken: string;
  token: string;
  _id: string
  isActive:boolean
}


export interface UserCredentials {
  userId: string;
  isAdmin: boolean;
}
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  wallet: {
    balance: number;
    transactions: {
      date: Date;
      details: string;
      amount: number;
      status: string;
    }[];
  };

}