import { UserService } from "../config/user.client";

export default class WalletController {
  updateWallet = async (data: {
    userId: string;
    amount: number;
    description: string;
    type: 'credit' | 'debit';
  }): Promise<{ success: boolean; message: string; wallet?: any }> => {
    return new Promise((resolve) => {
      UserService.UpdateWallet(
        {
          userId: data.userId,
          amount: data.amount,
          description: data.description,
          type: data.type,
        },
        (err: any, result: any) => {
          if (err) {
            console.error('Error updating wallet:', err);
            resolve({ success: false, message: err.message });
          } else {
            resolve({
              success: result.success,
              message: result.message,
              wallet: result.wallet,
            });
          }
        }
      );
    });
  };
}