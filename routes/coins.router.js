// MUXTASAR
import{Router} from "express";
import {findAll, findOne, createOne, updateOne, deleteOne, search} from "../controllers/coins.controller.js"
const CoinsRouter = Router()

CoinsRouter.get("/search", search)
CoinsRouter.get("/",  findAll);
CoinsRouter.get("/:id", findOne);
CoinsRouter.post("/",  createOne);
CoinsRouter.put("/:id",  updateOne )
CoinsRouter.delete("/:id", deleteOne)

export default CoinsRouter 