import { Socket } from "socket.io";

export interface Message {
  message: string;
  success?: boolean;
  refundRequired?: boolean;
  refundData?: any;
  data?:any;
  response?:any
  status?:string;
}

export interface AuthResponse {
  message: string;
  name: string;
  isOnline: boolean;
  isAdmin: boolean;
  refreshToken: string;
  token: string;
  _id: string;
  isActive: boolean;
  role: string;
}


export interface UserCredentials {
  userId: string;
  isAdmin: boolean;
  role: string;
  message: string;
}
export interface Tokens {
  accessToken: string;
  refreshToken: string;
  message: string;
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

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedToken {
  clientId: string;
  role: string;
}

export interface AuthenticatedSocket extends Socket {
  decoded?: DecodedToken
}