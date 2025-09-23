import dotenv from 'dotenv'
import {
  Client
} from "@hashgraph/sdk";

dotenv.config()

// Operator credentials
const operatorId  = process.env.OPERATOR_ID;
const operatorKey = process.env.OPERATOR_KEY;

// Initialize testnet client 
export const client = Client.forTestnet().setOperator(operatorId, operatorKey);

