import express from "express";
import UserController from "../controller/userController";

const userRoute = express.Router();
const userController = new UserController();

userRoute.get('/listUser', userController.listAll);
userRoute.post('/register', userController.create);
userRoute.post('/login', userController.login);
userRoute.delete('/deleteUser/:id', userController.delete);

export default userRoute