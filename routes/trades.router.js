// MUXTASAR
import{Router} from "express";
import {findAll, findOne, createOne, updateOne, deleteOne, search} from "../controllers/trades.controller.js"
const TradesRouter = Router()

TradesRouter.get("/search", search)
TradesRouter.get("/", findAll);
TradesRouter.get("/:id", findOne);
TradesRouter.post("/", createOne);
TradesRouter.put("/:id",updateOne )
TradesRouter.delete("/:id",deleteOne)

export default TradesRouter