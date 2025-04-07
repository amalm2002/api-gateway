import { Request, Response } from 'express'
import { UserService } from './config/user.client'
import { AuthResponse } from '../../interfaces/interface';


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
            isAdmin:result.isAdmin,
            isActive:result.isActive
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
              refreshToken: result.refreshToken
            })
          }
        }
      )

    } catch (error) {
      console.log('this eroor as show on google signin side :', error);
      res.status(500).json({ message: 'internal server error on google signin side' })
    }

  }

}

