import express from "express"
import trackController from "./controller.js"

const trackRoutes = express.Router();

/*
  * add and update event method
  * add & update account method
*/
trackRoutes.post('/account',trackController.createAccount)
trackRoutes.put('/account/:id',trackController.updateAccount)

//
//trackRoutes.post('/event',trackController.createAccount)
export default trackRoutes
