import {
  PrivateKey,
  AccountCreateTransaction,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType
} from "@hashgraph/sdk"

import { client } from "../../config.js"

function generateKeypair() {
  try {
    const randomPrivateKey = PrivateKey.generateECDSA()// EVM compatible
    const randomPublicKey = randomPrivateKey.publicKey
    return {
      randomPrivateKey,
      randomPublicKey,
    };
  } catch (e) {
    throw new Error("Exception occur during keypair generation")
  }

}

export async function createAccount() {
  const keypair = generateKeypair()

  try {
    const tx = new AccountCreateTransaction()
      .setKey(keypair.randomPublicKey)
      .setInitialBalance(100)

    const txResponse = await tx.execute(client)
    const receipt = await txResponse.getReceipt(client)

    return {
      accountId: receipt.accountId.toString(),
      accountPublicKey: keypair.randomPublicKey.toString(),
      accountPrivateKey: keypair.randomPrivateKey.toString(),
    }

  } catch (e) {
    throw new Error("Exception occur during account creation")
  }

}

/**
 * Initialize a NFT Collection for the supervisor
 * 
 * @param {string} tokenName 
 * @param {string} tokenSymbol 
 * @param {string} supplyKey 
 * @param {string} supervisorAccountId 
 * @returns {string} tokenId
 */
export async function initializeCollection(tokenName, tokenSymbol, supplyKey, supervisorAccountId) {
  const supplyPrivateKey = PrivateKey.fromStringDer(supplyKey);

  //
  try {
    const tx = new TokenCreateTransaction()
      .setTokenName(tokenName)
      .setTokenSymbol(tokenSymbol)
      .setTokenType(TokenType.NonFungibleUnique)
      .setSupplyType(TokenSupplyType.Infinite)
      //.setMaxSupply(999999999)
      .setInitialSupply(0)
      .setSupplyKey(supplyPrivateKey)
      .setTreasuryAccountId(supervisorAccountId)
      .setDecimals(0)
      .freezeWith(client)

    const signedTx = await tx.sign(supplyPrivateKey);
    const txResponse = await signedTx.execute(client)

    const receipt = await txResponse.getReceipt(client);
    const tokenId = receipt.tokenId;

    return tokenId.toString()

  } catch (e) {
    console.error("NFT initialization failed:", e);
    throw new Error("Exception occur during NFT initialization")
  }

  
}
