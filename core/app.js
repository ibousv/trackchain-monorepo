import express from "express"
import cors from "cors"
import trackRoutes from "./src/api/route.js"

const app = express()

//app.use(cors)
app.use('/api',trackRoutes)

app.listen(4000,()=>{
  console.log("core server is listening to incoming request on port 4000")
})
