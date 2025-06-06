import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string().required(),
});

export default {

  // function register
  async register(req: IReqUser, res: Response) {
    const { fullName, username, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    try {
      await registerValidateSchema.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      //   simpan ke database
      const result = await UserModel.create({
        fullName,
        username,
        email,
        password,
      });
      res.status(200).json({
        message: "Success registration!",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  // function login
  async login(req: IReqUser, res: Response) {
    /**
     #swagger.requestBody = {
     required: true,
     schema: {$ref: "#/components/schemas/loginRequest"}
     }
     */
    const { identifier, password } = req.body as unknown as TLogin;

    try {
      // ambil data user berdasarkan identifier (email atau username)

      const userByIdentifier = await UserModel.findOne({
        $or: [{ username: identifier }, { email: identifier }],
      });

      if (!userByIdentifier) {
        return res.status(403).json({
          message: "User not found!",
          data: null,
        });
      }

      // validasi password
      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        return res.status(403).json({
          message: "Invalid password!",
          data: null,
        });
      }

      // generate token
      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      res.status(200).json({
        message: "Success login!",
        data: token,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  // function untuk identitas kita saat login
  async me(req: IReqUser, res: Response) {
    /**
     #swagger.security = [{
        "bearerAuth": []
    }]
     */
    try {
      const user = req.user 
      const result = await UserModel.findById(user?.id);

      res.status(200).json({
        message: "Success get user!",
        data: result,
      });
      
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

};
