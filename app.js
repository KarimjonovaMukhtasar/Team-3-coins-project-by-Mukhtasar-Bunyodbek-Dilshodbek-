import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import CollectionCoinsRouter from "./routes/collection_coins.router.js"
import CoinsRouter from "./routes/coins.router.js"
import TradesRouter from "./routes/trades.router.js"
import UsersRouter from "./routes/users.router.js"
// import TagsRouter from "./routes/tags.router.js"
import CollectionsRouter from "./routes/collections.router.js"
import CommentsRouter from "./routes/comments.router.js"
// import CollectionTagsRouter from "./routes/collection_tags.router.js"

dotenv.config()
const app = express()
app.use(express.json())
app.use(morgan('tiny'))
const PORT = process.env.PORT || 3000
app.use("/collection-coins", CollectionCoinsRouter)
app.use("/coins", CoinsRouter)
app.use("/trades", TradesRouter)
app.use("/users", UsersRouter)
// app.use("/tags", TagsRouter)
app.use("/collections", CollectionsRouter)
app.use("/comments", CommentsRouter)
// app.use("/collection-tags", CollectionTagsRouter)
app.listen(PORT, ()=>{
    console.log(`SERVER IS RUNNING SUCCESSFULLY ON PORT ${PORT}`)
})


