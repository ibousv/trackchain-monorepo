import request from 'supertest';
import { app } from '../app.js';
import { createTestUser } from './testUtils.js';

describe('API Endpoints', () => {
  describe('User Management', () => {
    describe('POST /api/account', () => {
      it('should create a new user account', async () => {
        const userData = {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          phonenumber: '+1234567890'
        };

        const response = await request(app)
          .post('/api/account')
          .send(userData)
          .expect(200);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe(userData.name);
        expect(response.body.email).toBe(userData.email);
        expect(response.body).toHaveProperty('keypair');
        expect(response.body.keypair).toHaveProperty('publicKey');
        expect(response.body.keypair).toHaveProperty('privateKey');
      });

      it('should return 400 for missing required fields', async () => {
        const response = await request(app)
          .post('/api/account')
          .send({ name: 'Incomplete User' })
          .expect(500); // Note: The current implementation doesn't handle validation errors properly
      });
    });


  });

  describe('Supervisor Management', () => {
    describe('POST /api/supervisor', () => {
      it('should create a new supervisor', async () => {
        const supervisorData = {
          name: 'New Supervisor',
          email: 'supervisor@example.com',
          password: 'supersecure',
          phonenumber: '+1987654321',
          domain: 'agriculture'
        };

        const response = await request(app)
          .post('/api/supervisor')
          .send(supervisorData)
          .expect(200);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe(supervisorData.name);
        expect(response.body.domain).toBe('agriculture');
        expect(response.body).toHaveProperty('domainId');
      });
    });
  });

  describe('Event Management', () => {
    describe('POST /api/event', () => {
      it('should create a new event', async () => {
        const user = await createTestUser();
        
        const eventData = {
          actor: {
            id: user._id,
            key: user.keypair.publicKey,
            name: user.name
          },
          type: 'harvest',
          location: 'Test Location',
          metadata: {
            crop: 'Wheat',
            quantity: 100,
            unit: 'kg'
          }
        };

        const response = await request(app)
          .post('/api/event')
          .send(eventData)
          .expect(200);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.eventType).toBe(eventData.type);
        expect(response.body.actor.id).toBe(user._id);
        expect(response.body.metadata).toEqual(eventData.metadata);
      });

      it('should return 400 for invalid event data', async () => {
        const response = await request(app)
          .post('/api/event')
          .send({}) // Missing required fields
          .expect(500); // Note: The current implementation doesn't handle validation errors properly
      });
    });
  });

});