# 📱 Setup Guide - Track-Collect Mobile

Guide d'installation complète pour développer et déployer l'application Track-Collect avec Capacitor.

## 🎯 Configuration initiale

### 1. Installation des dépendances
```bash
npm install
```

### 2. Build initial
```bash
npm run build
```

### 3. Initialisation Capacitor
```bash
# Ajouter les plateformes
npx cap add android
npx cap add ios  # macOS uniquement

# Première synchronisation
npm run mobile:sync
```

## 🤖 Android Setup

### Prérequis
1. **Android Studio** (dernière version)
2. **Android SDK** (API 33+)
3. **Java 17** (OpenJDK recommandé)

### Configuration
1. Ouvrir Android Studio
2. SDK Manager > Install Android SDK (API 33+)
3. Virtual Device Manager > Créer un AVD

### Développement
```bash
# Méthode rapide
npm run android

# Ou étape par étape
npm run mobile:sync
npx cap open android
```

### Debug
- Live reload : `npx cap run android --livereload`
- Chrome DevTools : `chrome://inspect`

### Build Release
1. Dans Android Studio : Build > Generate Signed Bundle/APK
2. Suivre l'assistant pour signer l'APK
3. L'APK sera dans `android/app/build/outputs/`

## 🍎 iOS Setup (macOS uniquement)

### Prérequis
1. **Xcode** (dernière version)
2. **iOS Simulator** ou appareil iOS
3. **Compte développeur Apple** (pour appareil physique)

### Configuration
1. Ouvrir Xcode
2. Preferences > Accounts > Ajouter Apple ID
3. iOS Simulator > Installer iOS récent

### Développement
```bash
# Méthode rapide
npm run ios

# Ou étape par étape
npm run mobile:sync
npx cap open ios
```

### Debug
- Live reload : `npx cap run ios --livereload`
- Safari Web Inspector : Develop > iOS Simulator

### Build Release
1. Dans Xcode : Product > Archive
2. Organizer > Distribute App
3. Suivre l'assistant App Store Connect

## 🌐 Web Development

### Développement local
```bash
npm run dev
# L'app sera sur http://localhost:3000
```

### Test responsive mobile
```bash
# Serveur accessible depuis réseau local
npm run dev
# Accès depuis mobile : http://[votre-ip]:3000
```

### Build production web
```bash
npm run build
# Fichiers dans dist/
```

## 🔧 Scripts utiles

```bash
# Développement
npm run dev                 # Serveur web de développement
npm run build              # Build production
npm run preview           # Preview du build

# Mobile
npm run mobile:build      # Build + copy vers mobile
npm run mobile:sync       # Build + sync avec plateformes
npm run android          # Sync + ouvrir Android Studio
npm run ios              # Sync + ouvrir Xcode

# Capacitor
npx cap add <platform>    # Ajouter plateforme
npx cap copy             # Copier web vers native
npx cap sync             # Copy + update native deps
npx cap run <platform>   # Build + run sur plateforme
npx cap open <platform>  # Ouvrir IDE natif
```

## 🚨 Troubleshooting

### Erreurs communes

**Build failed**
```bash
# Nettoyer et rebuilder
rm -rf node_modules dist android ios
npm install
npm run build
npx cap add android
npx cap add ios
```

**Android : SDK not found**
```bash
# Définir ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

**iOS : Code signing error**
1. Xcode > Signing & Capabilities
2. Sélectionner Team
3. Changer Bundle Identifier si nécessaire

**Capacitor outdated**
```bash
# Mettre à jour Capacitor
npm update @capacitor/core @capacitor/cli
npx cap sync
```

### Debug tips

**Voir les logs**
```bash
# Android
npx cap run android --livereload --consolelogs

# iOS  
npx cap run ios --livereload --consolelogs
```

**Reset complet**
```bash
rm -rf android ios
npx cap add android
npx cap add ios
npm run mobile:sync
```

## 📦 Structure après setup

```
├── android/                 # Projet Android Studio
│   ├── app/
│   ├── build.gradle
│   └── capacitor.settings.gradle
├── ios/                     # Projet Xcode
│   ├── App/
│   ├── App.xcodeproj
│   └── Podfile
├── dist/                    # Build web
├── src/
├── capacitor.config.ts      # Config Capacitor
└── package.json
```

## 🎨 Customisation

### Icons & Splash
1. Remplacer dans `public/` :
   - `icon-192x192.png`
   - `icon-512x512.png`
2. Regenerer assets natifs :
```bash
npm install @capacitor/assets -D
npx capacitor-assets generate
```

### Config app
Modifier `capacitor.config.ts` :
```typescript
const config: CapacitorConfig = {
  appId: 'com.votredomaine.trackco',
  appName: 'Votre Track-Collect',
  // ...
};
```

## 🚀 Déploiement

### Android
1. `npm run mobile:sync`
2. Android Studio > Build > Generate Signed Bundle
3. Upload sur Google Play Console

### iOS
1. `npm run mobile:sync`
2. Xcode > Product > Archive
3. Upload vers App Store Connect

### Web
1. `npm run build`
2. Deploy `dist/` sur votre serveur

## ✅ Checklist finale

- [ ] Node.js installé (18+)
- [ ] Dépendances installées (`npm install`)
- [ ] Build initial réussi (`npm run build`)
- [ ] Android Studio configuré (si Android)
- [ ] Xcode configuré (si iOS)
- [ ] Plateformes ajoutées (`npx cap add`)
- [ ] Première sync réussie (`npm run mobile:sync`)
- [ ] Test sur émulateur/simulateur
- [ ] Test sur appareil physique

🎉 **Votre app Track-Collect est prête !**