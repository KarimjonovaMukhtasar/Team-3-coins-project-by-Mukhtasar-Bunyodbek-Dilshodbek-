// MUXTASAR
import{Router} from "express";
import {findAll, findOne, createOne, updateOne, deleteOne, search} from "../controllers/collection_coins.controller.js"
const CollectionCoinsRouter = Router()

CollectionCoinsRouter.get("/search", search)
CollectionCoinsRouter.get("/", findAll);
CollectionCoinsRouter.get("/:id", findOne);
CollectionCoinsRouter.post("/", createOne);
CollectionCoinsRouter.put("/:id",updateOne )
CollectionCoinsRouter.delete("/:id",deleteOne)

export default CollectionCoinsRouter