import express from "express";
import ListItemController from "../controller/listItemController";
import { authMiddleware } from "../../../globals/middlewares/auth.middleware";

const listItemRoute = express.Router();
const listItemController = new ListItemController();

listItemRoute.post('/create/:listId/items', authMiddleware, listItemController.create);
listItemRoute.get('/getItemsByListId/:listId/items', authMiddleware, listItemController.getItemsByListId);
listItemRoute.get('/getStats/:listId/items/stats', authMiddleware, listItemController.getStats);
listItemRoute.get('/getItemById/items/:itemId', authMiddleware, listItemController.getItemById);
listItemRoute.put('/updateItem/items/:itemId', authMiddleware, listItemController.updateItem);
listItemRoute.patch('/items/:itemId/toggle', authMiddleware, listItemController.toggleCompletion);
listItemRoute.delete('/deleteItem/items/:itemId', authMiddleware, listItemController.deleteItem);

export default listItemRoute;