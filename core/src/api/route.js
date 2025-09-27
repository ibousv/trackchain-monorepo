import express from "express"
import trackController from "./controller.js"

const trackRoutes = express.Router();

// User endpoints
trackRoutes.post('/account', trackController.createAccount)
trackRoutes.put('/account/:id', trackController.updateAccount)

// Supervisor endpoints
trackRoutes.post('/supervisor', trackController.createSupervisor)
//trackRoutes.put('/supervisor/:id', trackController.updateAccount)

// Event endpoints
//trackRoutes.post('/event',trackController.createAccount)

export default trackRoutes
