import { Request, Response } from 'express'
import { UserService } from './config/user.client'
import { AuthResponse } from '../../interfaces/interface';
import { token } from 'morgan';


export default class userController {

  CreateUser = async (req: Request, res: Response) => {
    try {
      // console.log('Create user ------ ',req.body);

      const token = req.cookies.otp
      const otp = req.body.otp

      UserService.CreateUser(
        {
          ...req.body.formData,
          otp: req.body.otp,
          token: req.cookies.otp
        },
        (err: any, result: { message: string, isAdmin: boolean }) => {
          // console.log('createuser side result..........',result);

          if (err) {
            res.status(400).json({ message: result.message });
          } else {
            res.status(200).json({ message: result.message, isAdmin: result.isAdmin });
          }
        }
      );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal Server Error" });
    }
  };

  CheckUser = async (req: Request, res: Response) => {
    try {
      UserService.CheckUser(req.body, (err: any, result: { token: string; message: string }) => {
        if (err) {
          res.status(400).json({ message: err });
        } else {
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
    // console.log('resend OTP email ,', req.body.email);
    // console.log('resend OTP formData ,', { ...req.body.formData });

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
    // console.log('check user on api-gateway :', req.body);
    try {
      UserService.CheckUserLogin(req.body, (err: any, result: AuthResponse) => {
        if (err) {
          res.status(400).json({ message: err })
        } else {
          console.log('result of login user :', result);
          res.status(200).json({
            user: result.name,
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
    console.log('google data gettinon api-gatway :', req.body);
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
      // console.log('ForgotPasswordCheck request:', req.body);
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
      // console.log('ivide ethyyyyyyyyyy :', req.body);
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

}

