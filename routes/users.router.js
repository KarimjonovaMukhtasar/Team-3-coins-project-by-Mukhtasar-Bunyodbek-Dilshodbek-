// BUNYODBEK
import{Router} from "express";
import {findAll, findOne, createOne, updateOne, deleteOne, search} from "../controllers/users.controller.js"
const router = Router()

router.get("/search", search)
router.get("/", findAll);
router.get("/:id", findOne);
router.post("/", createOne);
router.put("/:id",updateOne )
router.delete("/:id",deleteOne)

export default router 