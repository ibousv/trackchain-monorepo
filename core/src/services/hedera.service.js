import {
  PrivateKey,
  AccountCreateTransaction,
} from "@hashgraph/sdk"

import {client} from "../../config.js"

function generateKeypair(){
  try{
    const randomPrivateKey = PrivateKey.generateECDSA()// EVM compatible
    const randomPublicKey = randomPrivateKey.publicKey
    return {
      randomPrivateKey,
      randomPublicKey,
    };
  }catch(e){
    throw new Error("Exception occur during keypair generation")
  }
 
}

export default async function createAccount(){
  const keypair = generateKeypair()

  try{
    const tx = new AccountCreateTransaction()
    .setKey(keypair.randomPublicKey)
    .setInitialBalance(100)

    const txResponse =await tx.execute(client)
    const receipt = await txResponse.getReceipt(client)
    
    return {
      accountId : receipt.accountId.toString(),
      accountPublicKey: keypair.randomPublicKey.toString(),
      accountPrivateKey: keypair.randomPrivateKey.toString(),
    }
    
    }catch (e){
      throw new Error("Exception occur during account creation")
    }
  
}
