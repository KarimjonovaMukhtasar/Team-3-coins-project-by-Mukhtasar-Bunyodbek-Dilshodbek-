import{Router} from "express";
import {findAll, findOne, createOne, updateOne, deleteOne, search} from "../controllers/tags.controller.js"
const TagsRouter = Router()

TagsRouter.get("/search", search)
TagsRouter.get("/",  findAll);
TagsRouter.get("/:id", findOne);
TagsRouter.post("/",  createOne);
TagsRouter.put("/:id",  updateOne )
TagsRouter.delete("/:id", deleteOne)

export default TagsRouter 