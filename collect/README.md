# Track-Collect Module

## Overview

Track-Collect is the data entry point and primary interface for field actors in the TrackChain framework. It is a simple, dedicated application (mobile or web) responsible for the raw data collection. Its main role is to ensure that the information entered is authentic, timestamped, and geolocated right at the source.

## Features

- **User-Friendly Interface**: A clean and intuitive interface for easy data collection.
- **Offline Capability**: Designed to operate in low-connectivity environments, with data synchronized later.
- **Secure Data Submission**: Data is sent to the Track-Core module via a secure REST API.
- **Geolocation and Timestamps**: Automatically captures location and time for all collected data.

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui, Lucide React
- **Mobile**: Capacitor

## Getting Started

To get started with the Track-Collect module, follow these steps:

1. **Navigate to the `collect` directory**:
   ```bash
   cd collect
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

## Building for Mobile (Android)

To build the mobile application for Android, follow these steps:

1. **Build the web assets**:
   ```bash
   npm run build
   ```
2. **Sync the web assets with Capacitor**:
   ```bash
   npx capacitor sync android
   ```
3. **Open the Android project in Android Studio**:
   ```bash
   npx capacitor open android
   ```
4. **Build the APK from Android Studio**:
   Once the project is open in Android Studio, you can build the APK using the standard Android Studio build process (`Build > Build Bundle(s) / APK(s) > Build APK(s)`).