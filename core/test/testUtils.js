import { User, Supervisor } from '../src/models/data.model.js';

export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    _id: '0.0.12345',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    phoneNumber: '+1234567890',
    keypair: {
      publicKey: 'test-public-key',
      privateKey: 'test-private-key',
    },
  };

  return await User.create({ ...defaultUser, ...userData });
};

export const createTestSupervisor = async (supervisorData = {}) => {
  const defaultSupervisor = {
    _id: '0.0.54321',
    name: 'Test Supervisor',
    email: 'supervisor@example.com',
    password: 'supersecure',
    phoneNumber: '+1987654321',
    domain: 'agriculture',
    keypair: {
      publicKey: 'supervisor-public-key',
      privateKey: 'supervisor-private-key',
    },
    domainId: '0.0.98765',
  };

  return await Supervisor.create({ ...defaultSupervisor, ...supervisorData });
};
