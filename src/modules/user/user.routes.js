import { Router } from "express";
import { createUserController, getAllNormalStudentsHandler, getAllStudentsHandler, getAllUsersHandler, getUserByIdEmail, getUserByRoomNumController, requestRoom, swapRoom, updateUserController, userLogin, verifyUserController } from "./user.controller.js";

const userRoutes = Router();

userRoutes.get("/get_all_users", getAllUsersHandler);
userRoutes.get("/get_all_students/:gender", getAllStudentsHandler);
userRoutes.get("/get_all_normal_students", getAllNormalStudentsHandler);
userRoutes.get("/get_by_email/:email", getUserByIdEmail);
userRoutes.get("/get_by_num/:num", getUserByRoomNumController);
userRoutes.post("/", createUserController);
userRoutes.put("/:email", updateUserController);
userRoutes.put("/verify/:email", verifyUserController);
userRoutes.post("/login", userLogin);
userRoutes.post("/request", requestRoom);
userRoutes.put("/swap/:reg1/:reg2", swapRoom);

export default userRoutes;
