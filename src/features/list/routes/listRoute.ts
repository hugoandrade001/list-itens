import express from "express";
import ListController from "../controller/listController";
import { authMiddleware } from "../../../globals/middlewares/auth.middleware";

const listRoute = express.Router();
const listController = new ListController();

listRoute.post('/createList', authMiddleware, listController.create);
listRoute.get('/getAllLists', authMiddleware, listController.getAllLists);
listRoute.get('/my-lists', authMiddleware, listController.getUserLists);
listRoute.get('/list/:id', authMiddleware, listController.getListById);
listRoute.put('/update/:id', authMiddleware, listController.updateList);
listRoute.delete('/delete/:id', authMiddleware, listController.deleteList);

export default listRoute;