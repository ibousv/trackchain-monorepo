# Track-Verify Module

## Overview

The Track-Verify module is the public-facing interface for verifying the authenticity and history of assets tracked by the TrackChain framework. It allows users to query the Hedera network to retrieve information about specific assets. This module consists of a frontend application and a backend server that communicates with the Hedera Mirror Nodes.

## Features

- **Public Verification**: Allows anyone to verify the authenticity and history of an asset.
- **Direct Hedera Integration**: Communicates directly with Hedera Mirror Nodes to retrieve asset information.
- **Frontend and Backend Separation**: A clear separation of concerns between the user interface and the backend logic.

## Technologies Used

### Frontend

- **Framework**: React, Vite
- **Styling**: Bootstrap
- **HTTP Client**: Axios

### Backend

- **Framework**: Express.js, Node.js
- **Database**: MongoDB (via Mongoose)
- **Hedera Integration**: `@hashgraph/sdk`

## Getting Started

To get started with the Track-Verify module, you need to run both the frontend and backend services.

### Backend Setup

1. **Navigate to the `backend` directory**:
   ```bash
   cd verify/backend
   ```
2. **Install the dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to the `frontend` directory**:
   ```bash
   cd verify/frontend
   ```
2. **Install the dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
4. **Open the application in your browser**:
   [http://localhost:3000](http://localhost:3000)
