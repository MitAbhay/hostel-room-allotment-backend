import Joi from "joi";
import { defaultErrorHandler } from "../../utils/error.js";
import {
  createUser,
  getAllNormalStudents,
  getAllStudents,
  getAllUsers,
  getUserByEmail,
  getUserByReg,
  getUserByRoomNum,
  getUserTypeCounts,
  updateUser,
} from "./user.service.js";
import bcryptjs from "bcryptjs";
import configs from "../../configs/index.js";
import jwt from "jsonwebtoken";
import { getRoomByRoomNumber, updateRoom } from "../room/room.service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const getAllUsersHandler = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return defaultErrorHandler({
      res,
      status: 500,
      message: error?.message,
    });
  }
};
export const getAllStudentsHandler = async (req, res) => {
  try {
    const { gender } = req.params;
    const users = await getAllStudents(gender);
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return defaultErrorHandler({
      res,
      status: 500,
      message: error?.message,
    });
  }
};
export const getAllNormalStudentsHandler = async (req, res) => {
  try {
    const users = await getAllNormalStudents();
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return defaultErrorHandler({
      res,
      status: 500,
      message: error?.message,
    });
  }
};
export const getUserByIdEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await getUserByEmail(email);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return defaultErrorHandler({
      res,
      status: 500,
      message: error?.message,
    });
  }
};
export const getUserByRoomNumController = async (req, res) => {
  const { num } = req.params;
  try {
    const user = await getUserByRoomNum(num);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return defaultErrorHandler({
      res,
      status: 500,
      message: error?.message,
    });
  }
};

export const createUserController = async (req, res) => {
  try {
    const schema = Joi.object({
      userName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      roomNumber: Joi.string(),
      gender: Joi.valid("male", "female").required(),
      role: Joi.valid("admin", "student").required(),
    });
    const reqData = schema.validate(req.body);
    if (reqData.error) {
      return res.status(404).json({
        error: reqData.error.details[0].message,
        success: false,
      });
    }
    const salt = bcryptjs.genSaltSync(10);
    const hashPass = bcryptjs.hashSync(req.body.password, salt);
    req.body.password = hashPass;
    const user = await createUser(req.body);
    return res
      .status(200)
      .json({ success: true, data: user, message: "User created" });
  } catch (error) {
    return defaultErrorHandler({
      res,
      status: 500,
      message: error?.message,
    });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { email } = req.params;
    const schema = Joi.object({
      fullName: Joi.string(),
      feeAmount: Joi.number(),
      address: Joi.string(),
      feeSbiRef: Joi.string(),
      phoneNumber: Joi.string(),
      registrationNumber: Joi.string(),
      roomNumber: Joi.string(),
      block: Joi.string(),
      feeReceipt: Joi.string(),
      isVerified: Joi.boolean(),
    });
    const reqData = schema.validate(req.body);
    if (reqData.error) {
      return res.status(404).json({
        error: reqData.error.details[0].message,
        success: false,
      });
    }
    const user = await getUserByEmail(email);
    const feeReceipt = req.body.feeReceipt;
    const base64Image = feeReceipt.split(";base64,").pop();

    // const buffer = Buffer.from(feeReceipt, "base64");
    const fileName = `image_${Date.now()}.png`;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, "uploads", fileName);
    fs.writeFile(filePath, base64Image, { encoding: "base64" }, async (err) => {
      if (err) {
        console.error("Error saving file:", err);
        return res.status(500).send("Error uploading image");
      }
      const fileUrl = `/uploads/${fileName}`;
      // console.log(fileUrl);
      req.body.feeReceipt = fileUrl;
      await updateUser(email, req.body);
    });
    return res
      .status(200)
      .json({ success: true, data: user, message: "User updated" });
  } catch (error) {
    return defaultErrorHandler({
      res,
      status: 500,
      message: error?.message,
    });
  }
};

export const verifyUserController = async (req, res) => {
  try {
    const { email } = req.params;
    const schema = Joi.object({
      isVerified: Joi.boolean(),
      status: Joi.valid("declined", "verified"),
      remarks: Joi.string().required(),
    });
    const reqData = schema.validate(req.body);
    if (reqData.error) {
      return res.status(404).json({
        error: reqData.error.details[0].message,
        success: false,
      });
    }
    const user = await getUserByEmail(email);
    const room = await getRoomByRoomNumber(user.roomNumber);
    const { remarks } = req.body;
    if (req.body.isVerified) {
      // if (room.size === room.currentSize) {
      //     return defaultErrorHandler({
      //         res,
      //         status: 401,
      //         message: "room already filled",
      //     });
      // }
      // if (room.currentSize + 1 === room.size) {
      //     await updateRoom(room._id, {
      //         currentSize: room.currentSize + 1,
      //         isFull: true,
      //     });
      await updateUser(email, { status: "verified", remarks });
      // } else {
      //     // await updateRoom(room._id, {
      //     //     currentSize: room.currentSize + 1,
      //     // });
      //     await updateUser(email, {status: "verified", remarks});
      // }
    } else {
      await updateUser(email, { status: "declined", remarks });
      await updateRoom(room._id, {
        currentSize: room.currentSize - 1,
      });
    }
    return res
      .status(200)
      .json({ success: true, data: user, message: "User updated" });
  } catch (error) {
    return defaultErrorHandler({
      res,
      status: 500,
      message: error?.message,
    });
  }
};
export const swapRoom = async (req, res) => {
  try {
    const { reg1, reg2 } = req.params;
    const user1 = await getUserByReg(reg1);
    const user2 = await getUserByReg(reg2);
    if (user1 && user2) {
      await updateUser(user1.email, { roomNumber: user2.roomNumber });
      await updateUser(user2.email, { roomNumber: user1.roomNumber });
    } else {
      return defaultErrorHandler({
        res,
        status: 401,
        message: "One or more student doesn't have room allocated",
      });
    }
    return res.status(200).json({ success: true, message: "User updated" });
  } catch (error) {
    return defaultErrorHandler({
      res,
      status: 500,
      message: error?.message,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const reqData = schema.validate(req.body);
    if (reqData.error) {
      return res.status(404).json({
        error: reqData.error.details[0].message,
        success: false,
      });
    }
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return defaultErrorHandler({
        status: 401,
        message: "No user found",
      });
    }
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return defaultErrorHandler({
        res,
        status: 401,
        message: "Invalid password",
      });
    }
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      configs.JWT_SECRET
    );
    return res.status(200).json({ success: true, data: user, token });
  } catch (error) {
    return defaultErrorHandler({
      res,
      status: 500,
      message: error?.message,
    });
  }
};
export const requestRoom = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().required(),
      roomNumber: Joi.number().required(),
    });
    const reqData = schema.validate(req.body);
    if (reqData.error) {
      return res.status(404).json({
        error: reqData.error.details[0].message,
        success: false,
      });
    }
    const { email, roomNumber } = req.body;
    const user = await getUserByEmail(email);
    const room = await getRoomByRoomNumber(roomNumber);
    if (!user)
      return defaultErrorHandler({
        res,
        status: 401,
        message: "no user found",
      });
    if (!room)
      return defaultErrorHandler({
        res,
        status: 401,
        message: "no room found",
      });
    if (room.isFull) {
      return defaultErrorHandler({
        res,
        status: 401,
        message: "room is full",
      });
    }
    room.currentSize = room.currentSize + 1;

    if (room.currentSize === room.size) {
      await updateRoom(room._id, {
        currentSize: room.currentSize,
        isFull: true,
      });
    } else {
      await updateRoom(room._id, {
        currentSize: room.currentSize,
      });
    }
    await updateUser(user.email, {
      roomNumber: room?.roomNumber,
      status: "pending",
    });
    return res
      .status(200)
      .json({ success: true, message: "room request sent" });
  } catch (error) {
    return defaultErrorHandler({
      res,
      status: 500,
      message: error?.message,
    });
  }
};
