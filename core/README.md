# Track-Core Module

## Overview
Track-Core is the central module of the TrackChain framework, designed to provide a lightweight server for interacting with the Hedera network. It serves as the backbone for managing users, supervisors, and events, with all data being securely stored in a MongoDB database.

## Features

- **User Management**: Create and update user accounts with Hedera wallet integration
- **Supervisor Management**: Special user type with additional privileges for managing events
- **Event Tracking**: Record and track events on the Hedera network with NFT-based verification
- **Blockchain Integration**: Seamless interaction with the Hedera network for account creation and NFT management
- **RESTful API**: Easy-to-use endpoints for all operations



## API Endpoints

### User Endpoints

#### Create User
```http
POST /api/account
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phonenumber": "+1234567890"
}
```

#### Update User
```http
PUT /api/account/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

### Supervisor Endpoints

#### Create Supervisor
```http
POST /api/supervisor
Content-Type: application/json

{
  "name": "Supervisor Name",
  "email": "supervisor@example.com",
  "password": "securepassword",
  "phonenumber": "+1234567890"
}
```

### Event Endpoints

#### Create Event
```http
POST /api/event
Content-Type: application/json

{
  "actor": {
    "id": "0.0.12345",
    "key": "302e020100300506032b657004220420..."
  },
  "type": "harvest",
  "location": "Farm A, Location B",
  "metadata": {
    "cropType": "Wheat",
    "quantity": 100,
    "unit": "kg"
  }
}
```

## Data Models

### User
- `_id`: String (Hedera Account ID)
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `phoneNumber`: String (unique)
- `keypair`: Object
  - `publicKey`: String
  - `privateKey`: String (encrypted)
- `createdAt`: Date
- `updatedAt`: Date

### Supervisor
- `_id`: String (Hedera Account ID)
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `phoneNumber`: String (unique)
- `keypair`: Object
  - `publicKey`: String
  - `privateKey`: String (encrypted)
- `domain`: enum of String (agriculture, land, health) 
- `domainId`: String (NFT Token ID for the supervisor's domain)
- `createdAt`: Date
- `updatedAt`: Date

### Event
- `_id`: String (NFT Serial Number)
- `actor`: Object (current User reference)
- `eventType`: String
- `eventDate`: Date
- `location`: String
- `metadata`: Object (Event-specific data)
- `createdAt`: Date
- `updatedAt`: Date

