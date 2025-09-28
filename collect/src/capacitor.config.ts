import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.trackco.collect",
  appName: "Track-Collect",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    App: {
      launchShowDuration: 0,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#000000",
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true,
    },
    Haptics: {},
    Share: {},
    Filesystem: {
      directory: "DOCUMENTS",
    },
    Device: {},
    Network: {},
  },
  ios: {
    contentInset: "automatic",
    backgroundColor: "#ffffff",
  },
  android: {
    backgroundColor: "#ffffff",
    allowMixedContent: true,
    captureInput: true,
  },
};

export default config;