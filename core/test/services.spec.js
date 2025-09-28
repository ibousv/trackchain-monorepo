import { createAccount, initializeCollection, mintNFT, associateNFT } from '../src/services/hedera.service.js';

describe('Hedera Service', () => {
  describe('createAccount', () => {
    it('should create a new Hedera account', async () => {
      const result = await createAccount();
      
      expect(result).toHaveProperty('accountId');
      expect(result).toHaveProperty('accountPublicKey');
      expect(result).toHaveProperty('accountPrivateKey');
      expect(result.accountId).toBe('0.0.12345');
      expect(result.accountPublicKey).toBe('mock-public-key');
      expect(result.accountPrivateKey).toBe('mock-private-key');
    });
  });

  describe('initializeCollection', () => {
    it('should initialize a new token collection', async () => {
      const tokenId = await initializeCollection('TestToken', 'TT', 'test-private-key', '0.0.12345');
      
      expect(tokenId).toBe('0.0.54321');
    });
  });

  describe('associateNFT', () => {
    it('should associate an NFT with an account', async () => {
      await expect(
        associateNFT('0.0.54321', 'test-public-key', '0.0.12345')
      ).resolves.not.toThrow();
    });
  });

  describe('mintNFT', () => {
    it('should mint a new NFT', async () => {
      const metadata = {
        name: 'Test NFT',
        description: 'Test Description',
        image: 'test-image-url'
      };
      
      const serialNumber = await mintNFT(
        '0.0.54321',
        'test-supply-key',
        metadata,
        '0.0.12345',
        '0.0.54321'
      );
      
      expect(serialNumber).toBe(1);
    });
  });
});