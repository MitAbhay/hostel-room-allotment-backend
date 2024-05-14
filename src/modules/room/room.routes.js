import { Router } from "express";
import { createDummyData, createRoomController, getAllRoomsController, getRoomByIdEmail, getRoomByRoomNumController, updateRoomController } from "./room.controller.js";

const roomRoutes = Router();

roomRoutes.get("/get_all_rooms/:block/:whom", getAllRoomsController);
roomRoutes.get("/get_by_num/:num", getRoomByRoomNumController);
roomRoutes.get("/get_by_id/:id", getRoomByIdEmail);
roomRoutes.post("/", createRoomController);
roomRoutes.put("/:id", updateRoomController);
roomRoutes.get("/create_dummy_data", createDummyData);

export default roomRoutes;
