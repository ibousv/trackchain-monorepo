const { Client, TopicCreateTransaction, TopicMessageSubmitTransaction } = require('@hashgraph/sdk');
require('dotenv').config();

let client = null;
if (process.env.HEDERA_ACCOUNT_ID && process.env.HEDERA_PRIVATE_KEY) {
  client = Client.forTestnet();
  client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);
}

async function recordHashOnHedera(hash) {
  if (!client) {
    return { success: true, note: 'Hedera not configured - simulated', txId: null };
  }
  try {
    const topicTx = await new TopicCreateTransaction().execute(client);
    const topicReceipt = await topicTx.getReceipt(client);
    const topicId = topicReceipt.topicId;

    const submitTx = await new TopicMessageSubmitTransaction({ topicId }).setMessage(hash).execute(client);
    const submitReceipt = await submitTx.getReceipt(client);

    return { success: true, txId: submitReceipt.status.toString(), topicId: topicId.toString() };
  } catch (err) {
    console.error('Hedera error', err);
    return { success: false, error: err.message };
  }
}

module.exports = { recordHashOnHedera };
