import express from "express"
import cors from "cors"
import trackRoutes from "./src/api/route.js"
import databaseConnection from "./src/models/data.schema.js"

const app = express()

//app.use(cors)
app.use('/api',trackRoutes)

app.listen(4000,async ()=>{
  databaseConnection()
  console.log("core server is listening to incoming request on port 4000")
})
