import { Request, Response } from 'express'
import { UserService } from '../config/user.client'
import { AuthResponse } from '../../../interfaces/interface'




export default class userController {

  CreateUser = async (req: Request, res: Response) => {
    try {
      UserService.CreateUser(
        {
          ...req.body.formData,
          otp: req.body.otp,
          token: req.body.token
        },
        (err: any, result: { message: string, isAdmin: boolean }) => {
          if (err) {
            res.status(400).json({ message: result.message });
          } else {
            res.status(200).json({ message: result.message, isAdmin: result.isAdmin });
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  CheckUser = async (req: Request, res: Response) => {
    try {
      UserService.CheckUser(req.body, (err: any, result: { token: string; message: string }) => {

        console.log(`📤 [API Gateway → UserService]`, req.body)

        if (err) {
          console.log('++++++++++++++ :',err)
          res.status(400).json({ message: err });
        } else {

           console.log(`📥 [API Gateway ← UserService] Response:`, result);

          res.cookie('otp', result.token, {
            httpOnly: true,
            expires: new Date(Date.now() + 180000),
            sameSite: 'none',
            secure: true
          })
          res.status(200).json({ message: result.message, token: result.token })
        }
      })

    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal Server Error" });
    }
  }

  ResendOtp = async (req: Request, res: Response) => {
    try {
      UserService.ResendOtp(
        {
          email: req.body.email,
          ...req.body.formData
        },
        (err: any, result: { message: string; token: string }) => {
          if (err) {
            res.status(400).json({ message: result.message });
          } else {

            res.cookie('otp', result.token, {
              httpOnly: true,
              expires: new Date(Date.now() + 180000),
              sameSite: 'none',
              secure: true
            });

            res.status(200).json({ message: result.message, token: result.token });
          }
        }
      );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal Server Error on check user side" });
    }
  };

  CheckUserLogin = async (req: Request, res: Response) => {
    try {
      UserService.CheckUserLogin(req.body, (err: any, result: AuthResponse) => {
        if (err) {
          res.status(400).json({ message: err })
        } else {
          console.log('result :', result)
          res.status(200).json({
            user: result.name,
            userId: result._id,
            message: result.message,
            token: result.token,
            refreshToken: result.refreshToken,
            isAdmin: result.isAdmin,
            isActive: result.isActive,
            role: result.role
          })
        }
      })

    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal Server Error on login side" });
    }

  }

  CheckGoogleSignInUser = async (req: Request, res: Response) => {
    try {
      UserService.CheckGoogleSignIn(req.body,
        (err: any, result: AuthResponse) => {
          if (err) {
            console.log('error on api-gateway googlesignin side controller');
            res.status(401).json({ message: err })
          } else {
            console.log('google callback result :', result);
            res.status(200).json({
              user: result.name,
              user_id: result._id,
              message: result.message,
              token: result.token,
              refreshToken: result.refreshToken,
              isAdmin: result.isAdmin,
              isActive: result.isActive,
              role: result.role
            })
          }
        }
      )

    } catch (error) {
      console.log('this eroor as show on google signin side :', error);
      res.status(500).json({ message: 'internal server error on google signin side' })
    }

  }

  ForgotPasswordCheck = async (req: Request, res: Response) => {
    try {
      UserService.ForgotPasswordUser(req.body, (err: any, result: { message: string; token?: string }) => {
        if (err) {
          console.error('Error in ForgotPasswordCheck:', err);
          return res.status(400).json({ message: err.message || 'Error checking email' });
        }

        if (result.message === 'user exist' && result.token) {
          res.cookie('otp', result.token, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 1000),
            sameSite: 'none',
            secure: true,
          });
          return res.status(200).json({ message: 'OTP sent successfully', token: result.token });
        } else {
          return res.status(404).json({ message: result.message });
        }
      });
    } catch (error) {
      console.error('Error in ForgotPasswordCheck:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  VerifyOtp = async (req: Request, res: Response) => {
    try {
      const { email, otp, token } = req.body
      UserService.VerifyOtp({ email, otp, token }, (err: any, result: { message: string }) => {
        if (err) {
          console.log('error on forgot-pass verify-otp side ', err);
          return res.status(400).json({ message: err.message || 'Invalid OTP' });
        }
        return res.status(200).json({ message: result.message })
      })
    } catch (error) {
      console.error('Error in veify-otp:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  RestPassword = async (req: Request, res: Response) => {
    try {
      const { email, password, token } = req.body;
      UserService.ResetPassword({ email, password, token }, (err: any, result: { message: string }) => {
        if (err) {
          console.error('Error resetting password:', err);
          return res.status(400).json({ message: err.message || 'Failed to reset password' });
        }
        return res.status(200).json({ message: result.message });
      });
    } catch (error) {
      console.error('Error in rest-password:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  GetUserById = async (req: Request, res: Response) => {
    try {
      UserService.GetUserById({ id: req.params.id }, (err: any, result: any) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
          res.status(200).json({ message: result.message, response: result });
        }
      });
    } catch (error) {
      console.log('error has to show on the GetUserById controller', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  EditProfile = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, phone } = req.body;
      UserService.UpdateUser({ id, name, phone }, (err: any, result: any) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
          res.status(200).json({ response: result });
        }
      });
    } catch (error) {
      console.log('error in EditProfile controller', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  addNewAddress = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { address, index } = req.body;

      UserService.UpdateUserAddress(
        {
          userId: id,
          address: {
            city: address.city,
            pinCode: Number(address.pinCode),
            state: address.state,
            street: address.street,
          },
          index: Number(index),
        }, (err: any, result: any) => {
          if (err) {
            console.log(err);

            res.status(400).json({ message: err.message });
          } else {
            res.status(200).json({ message: result.message, response: result });
          }
        })

    } catch (error) {
      console.log('error in add-new-address controller', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  deleteUserAddress = async (req: Request, res: Response) => {
    try {
      const { id, index } = req.params
      const addressIndex = parseInt(index)
      UserService.DeleteUserAddress(
        { id: req.params.id, index: addressIndex },
        (err: any, result: any) => {
          if (err) {
            res.status(400).json({ message: err.message });
          } else {
            res.status(200).json({ success: true, message: result.message });
          }
        }
      );

    } catch (error) {
      console.log('error has to show on the delete address side', error);
      res.status(500).json({ message: 'Internal Server Error' });

    }
  }
}

