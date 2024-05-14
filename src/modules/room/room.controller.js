import Joi from "joi";
import { defaultErrorHandler } from "../../utils/error.js";
import bcryptjs from 'bcryptjs';
import { createManyRoom, createRoom, getAllRooms, getRoomById, getRoomByRoomNumber, updateRoom } from "./room.service.js";
import dummyData from "../../utils/dummyRoomData.js"

export const getAllRoomsController = async (req, res) => {
    const {block,whom} = req.params;
    try {
        const rooms = await getAllRooms(block,whom);
        return res.status(200).json({
            success: true,
            rooms,
        });
    } catch (error) {
        return defaultErrorHandler({res, status: 500, message: error?.message});
    }
};

export const getRoomByIdEmail = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await getRoomById(id);
        return res.status(200).json({success: true, data: room });
    } catch (error) {
        return defaultErrorHandler({res, status: 500, message: error?.message});
    }
};
export const getRoomByRoomNumController = async (req, res) => {
    const {num} = req.params;
    try {
        const room = await getRoomByRoomNumber(num);
        return res.status(200).json({success: true, data: room });
    } catch (error) {
        return defaultErrorHandler({res, status: 500, message: error?.message});
    }
};

export const createRoomController = async (req, res) => {
    try {
        const schema = Joi.object({
            roomNumber: Joi.number().required(),
            block: Joi.string().required(),
            size: Joi.number().required(),
            slots: Joi.number().required(),
            roomType: Joi.valid("boys", "girls").required(),
        });
        const reqData = schema.validate(req.body);
        if (reqData.error) {
            return res.status(404).json({
                error: reqData.error.details[0].message,
                success: false
            });
        }
        const room = await createRoom(req.body);
        return res.status(200).json({success: true, data: room, message: "Room created" });
    } catch (error) {
        return defaultErrorHandler({res, status: 500, message: error?.message});
    }
};

export const updateRoomController = async (req, res) => {
    try {
        const {id} = req.params;
        const schema = Joi.object({
            currentSize: Joi.number(),
        });
        const reqData = schema.validate(req.body);
        if (reqData.error) {
            return res.status(404).json({
                error: reqData.error.details[0].message,
                success: false
            });
        }
        const room = await updateRoom(id, req.body);
        return res.status(200).json({success: true, message: "Room updated" });
    } catch (error) {
        return defaultErrorHandler({res, status: 500, message: error?.message});
    }
};

export const createDummyData = async (req, res) => {
    try {
        const room = await createManyRoom(dummyData);
        return res.status(200).json({success: true, message: "Dummy room created" });
    } catch (error) {
        return defaultErrorHandler({res, status: 500, message: error?.message});
    }
};
