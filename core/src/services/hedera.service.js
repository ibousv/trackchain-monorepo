import {
  PrivateKey,
  AccountCreateTransaction,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  TokenAssociateTransaction,
  TransferTransaction
} from "@hashgraph/sdk"

import { client } from "../../config.js"

function generateKeypair() {
  try {
    const randomPrivateKey = PrivateKey.generateECDSA()
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


export async function initializeCollection(tokenName, tokenSymbol, supplyKey, supervisorAccountId) {
  const supplyPrivateKey = PrivateKey.fromStringDer(supplyKey)

  try {
    const tx = new TokenCreateTransaction()
      .setTokenName(tokenName)
      .setTokenSymbol(tokenSymbol)
      .setTokenType(TokenType.NonFungibleUnique)
      .setSupplyType(TokenSupplyType.Infinite)
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
    console.error("NFT initialization failed:", e)
    throw new Error("Exception occur during NFT initialization")
  }

}

export async function mintNFT(tokenId, supplyKey, metadata, targetAccountId, supervisorAccountId) {
  const supplyPrivateKey = PrivateKey.fromStringDer(supplyKey)

  try {

    const tx = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setMetadata([metadata])
      .freezeWith(client)

    const signedTx = await tx.sign(supplyPrivateKey)
    const txResponse = await signedTx.execute(client)

    const receipt = await txResponse.getReceipt(client)
    const serialNumber = receipt.serials[0] 

    // Transfer the minted NFT to the target account
    const transferTx = new TransferTransaction()
      .addNftTransfer(tokenId, serialNumber, supervisorAccountId, targetAccountId)
      .freezeWith(client)

    const signedTransferTx = await transferTx.sign(supplyPrivateKey)
    await signedTransferTx.execute(client)

    return serialNumber.toString()

  } catch (e) {
    console.error("NFT minting and transfer failed:", e)
    throw new Error("Exception occur during the minting and transfer process")
  }

}

export async function associateNFT(tokenId, associatedKey,associateAccountId) {
  const receiverKey = PrivateKey.fromStringDer(associatedKey)

  try {

    const tx = new TokenAssociateTransaction()
      .setAccountId(associateAccountId)
      .setTokenIds([tokenId])
      .freezeWith(client)

    const signedTx = await tx.sign(receiverKey)
    const txResponse = await signedTx.execute(client)
    const receipt = await txResponse.getReceipt(client)

    return receipt.status

  } catch (e) {
    console.error("NFT associating failed:", e)
    throw new Error("Exception occur during the association process")
  }

}

export async function transferNFT(tokenId, serialNumber, senderAccountId, receiverAccountId, senderAccountKey) {
  const senderKey = PrivateKey.fromStringDer(senderAccountKey);

  try {
    const transferTx = new TransferTransaction()
      .addNftTransfer(tokenId, serialNumber, senderAccountId, receiverAccountId)
      .freezeWith(client);

    const signedTx = await transferTx.sign(senderKey);
    const txResponse = await signedTx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    return receipt.status;
  } catch (e) {
    console.error("NFT transfer failed:", e);
    throw new Error("Exception occurred during the NFT transfer process");
  }
}