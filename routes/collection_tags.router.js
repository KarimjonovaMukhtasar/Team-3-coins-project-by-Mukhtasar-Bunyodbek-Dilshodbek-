import{Router} from "express";
import {findAll, findOne, createOne, updateOne, deleteOne, search} from "../controllers/collection_tags.controller.js"
const CollectionTagsRouter = Router()

CollectionTagsRouter.get("/", findAll);
CollectionTagsRouter.get("/:id", findOne);
CollectionTagsRouter.post("/", createOne);
CollectionTagsRouter.delete("/:id",deleteOne)

export default CollectionTagsRouter