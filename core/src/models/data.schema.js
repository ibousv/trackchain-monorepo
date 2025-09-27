import mongoose from 'mongoose'

const db = await mongoose.connect(process.env.MONGOOSE_DATABASE_URI)
  .then(() => console.log("Connected to Mongoose Cluster successfully"))
  .catch((e) => console.error(e))

export default async function databaseConnection() {
  return db
}

// Schema 
// from Owner to User
export const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    keypair: {
      publicKey: {
        type: String,
        required: true,
      },
      privateKey: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
)


// from Entity to Event
export const EventSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    actorId: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      default: Date.now
    },
    location: {
      type: String,
      required: true,
    },
    metadata: {
      type: Object,
      default: null,
      required: false
    }
  },
  {
    timestamps: true,
  },
)

export const SupervisorSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    domain: {
      type: String,
      enum: ['agriculture', 'land', 'health'],
      default: "agriculture", // used by default for testing the MVP
    },
    domainId: {
      type: String,
      required: true,
    },
    keypair: {
      publicKey: {
        type: String,
        required: true,
      },
      privateKey: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },

)

