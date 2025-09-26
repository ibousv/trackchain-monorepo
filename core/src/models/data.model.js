import { UserSchema, EventSchema, SupervisorSchema} from "./data.schema.js"
import mongoose from 'mongoose'

export const User =  mongoose.model('User',UserSchema)
export const Event =  mongoose.model('Event',EventSchema)
export const Supervisor = mongoose.model('Supervisor',SupervisorSchema)

