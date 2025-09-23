import express from "express"
import trackController from "./controller.js"

const trackRoutes = express.Router();

trackRoutes.get('/account',trackController.createAccount)

export default trackRoutes
