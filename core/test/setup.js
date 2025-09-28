import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

// Setup in-memory MongoDB for testing
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});


afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});


afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Mock Hedera SDK 
jest.mock('@hashgraph/sdk', () => ({
  Client: jest.fn().mockImplementation(() => ({
    setOperator: jest.fn(),
    forTestnet: jest.fn().mockReturnThis(),
  })),
  PrivateKey: {
    generateED25519: jest.fn().mockReturnValue({
      toString: () => 'mock-private-key',
      publicKey: {
        toString: () => 'mock-public-key',
      },
    }),
  },
  AccountId: {
    fromString: jest.fn().mockReturnValue('0.0.12345'),
  },
  TokenCreateTransaction: jest.fn().mockImplementation(() => ({
    setTokenName: jest.fn().mockReturnThis(),
    setTokenSymbol: jest.fn().mockReturnThis(),
    setTreasuryAccountId: jest.fn().mockReturnThis(),
    setAdminKey: jest.fn().mockReturnThis(),
    setSupplyKey: jest.fn().mockReturnThis(),
    freezeWith: jest.fn().mockReturnThis(),
    sign: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({
      getReceipt: jest.fn().mockResolvedValue({
        tokenId: '0.0.54321',
      }),
    }),
  })),
  TokenAssociateTransaction: jest.fn().mockImplementation(() => ({
    setTokenIds: jest.fn().mockReturnThis(),
    setAccountId: jest.fn().mockReturnThis(),
    freezeWith: jest.fn().mockReturnThis(),
    sign: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({
      getReceipt: jest.fn().mockResolvedValue({}),
    }),
  })),
  TokenMintTransaction: jest.fn().mockImplementation(() => ({
    setTokenId: jest.fn().mockReturnThis(),
    setMetadata: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({
      getReceipt: jest.fn().mockResolvedValue({
        serialNumbers: [1],
      }),
    }),
  })),
}));
