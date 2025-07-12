import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";

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
  password: Yup.string()
    .required()
    .min(6, "Password must be at least 6 characters")
    .test(
      "at-least-one-uppercase-letter",
      "Content at least one uppercase letter",
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
      }
    )
    .test(
      "at-least-one-number",
      "Content at least one uppercase letter",
      (value) => {
        if (!value) return false;
        const regex = /(?=.*[0-9])/;
        return regex.test(value);
      }
    ),
  confirmPassword: Yup.string().required(),
});

export default {
  // function register
  async register(req: IReqUser, res: Response) {
    /**
     
    #swagger.tags = ['Auth']
     */
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
     const user = await UserModel.create({
       fullName,
       username,
       email,
       password,
     });


     res.status(200).json({
       message: "Success registration!",
       data: user,
     });

     response.success(res, user, "Success registration!");

    } catch (error) {
      response.error(res, error, "Failed registration!");
    }
  },

  // function login
  async login(req: IReqUser, res: Response) {
    /**
     #swagger.tags = ['Auth']
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

        // hanya user yg sudah mengajtifkan activation code yg bisa login
       isActive: true,
      });

      if (!userByIdentifier) {
       return response.unauthorized(res, "user not found");
      }

      // validasi password
      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
       return response.unauthorized(res, "user not found");
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

      response.success(res, token, "Success login!");
    } catch (error) {
      response.error(res, error, "Failed login!");
    }
  },

  // function untuk identitas kita saat login
  async me(req: IReqUser, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
        "bearerAuth": []
    }]
     */
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);

      res.status(200).json({
        message: "Success get user!",
        data: result,
      });

      response.success(res, result, "Success get user profil!");
    } catch (error) {
      response.error(res, error, "Failed get user profil!");
    }
  },

  async activation(req: Request, res: Response) {
    /**
  #swagger.tags = ['Auth']
  #swagger.requestBody = {
    required: true,
        schema: { $ref: "#/components/schemas/ActivationRequest" }
  }
*/

    try {
      const { code } = req.body as { code: string };
      const user = await UserModel.findOneAndUpdate(
        { activationCode: code },
        { isActive: true },
        { new: true }
      );

      res.status(200).json({
        message: "user successfully activated",
        data: user,
      });
      response.success(res, user, "user successfully activated");
    } catch (error) {
      response.error(res, error, "user is failed activated");
    }
  },
};
