# Track-Collect Mobile

Application hybride React + Capacitor pour la collecte de données de traçabilité multi-domaine.

## 🚀 Installation

### Prérequis
- Node.js (version 18+)
- Pour Android : Android Studio avec SDK
- Pour iOS : Xcode (macOS uniquement)

### Installation des dépendances
```bash
npm install
```

### Développement web
```bash
# Lancer le serveur de développement web
npm run dev

# Construire pour la production
npm run build
```

### Développement mobile

#### Première configuration
```bash
# Construire l'app web
npm run build

# Ajouter les plateformes
npx cap add android
npx cap add ios

# Synchroniser les fichiers
npm run mobile:sync
```

#### Android
```bash
# Ouvrir Android Studio
npm run android

# Ou manuellement :
npm run mobile:sync
npx cap open android
```

#### iOS (macOS uniquement)
```bash
# Ouvrir Xcode
npm run ios

# Ou manuellement :
npm run mobile:sync
npx cap open ios
```

### Scripts disponibles
- `npm run dev` - Serveur de développement web
- `npm run build` - Build de production
- `npm run mobile:build` - Build + copie vers mobile
- `npm run mobile:sync` - Build + sync avec plateformes
- `npm run android` - Sync + ouvrir Android Studio
- `npm run ios` - Sync + ouvrir Xcode

## 📱 Fonctionnalités mobiles

### API Capacitor intégrées
- **📳 Haptic Feedback** : Vibrations tactiles sur actions
- **🔙 Back Button** : Gestion du bouton retour Android
- **📊 Status Bar** : Personnalisation de la barre de statut
- **📤 Share API** : Partage natif des données
- **💾 Filesystem** : Sauvegarde locale des fichiers
- **📶 Network** : Détection de la connectivité
- **📱 Device Info** : Informations sur l'appareil

### Optimisations mobiles
- Interface adaptée aux écrans tactiles
- Navigation par onglets en bas d'écran
- Feedback haptique sur les interactions
- Gestion native du bouton retour
- Export/partage optimisé par plateforme

## 🏗️ Architecture

### Pages principales
- **SignIn/SignUp** : Authentification
- **Home** : Collecte de nouvelles données
- **Data** : Visualisation et export des données
- **Settings** : Paramètres utilisateur

### Données collectées
```typescript
interface CollectedData {
  id: string;
  asset_id: string;      // ID de l'actif
  actor_id: string;      // ID de l'acteur
  event_type: string;    // Type d'événement
  event_date: string;    // Date/heure
  location: string;      // Localisation
  metadata: string;      // Métadonnées JSON
  created_at: string;    // Timestamp création
}
```

### Types d'événements
- Plantation, Arrosage, Fertilisation
- Traitement, Récolte, Transformation
- Conditionnement, Transport, Stockage, Vente

## 🛠️ Technologies

- **React 18** + **TypeScript** : Frontend
- **Capacitor 6** : Framework hybride
- **Vite** : Build tool rapide
- **Tailwind CSS** : Styling
- **Lucide React** : Icônes
- **Sonner** : Notifications

## 📁 Structure

```
├── src/
│   ├── main.tsx              # Point d'entrée React
│   └── hooks/
│       └── useCapacitor.ts   # Hook Capacitor
├── screens/                  # Pages de l'app
├── components/               # Composants réutilisables
├── capacitor.config.ts       # Configuration Capacitor
├── android/                  # Projet Android (généré)
├── ios/                      # Projet iOS (généré)
└── dist/                     # Build web (généré)
```

## 🔧 Configuration

### capacitor.config.ts
```typescript
const config: CapacitorConfig = {
  appId: 'com.trackco.collect',
  appName: 'Track-Collect',
  webDir: 'dist',
  // ... autres configurations
};
```

### Permissions Android
Les permissions suivantes sont automatiquement gérées :
- Internet (pour la connectivité)
- Write External Storage (pour l'export)
- Vibrate (pour le feedback haptique)

## 🚢 Déploiement

### Android
1. Build : `npm run mobile:sync`
2. Ouvrir Android Studio : `npx cap open android`
3. Build > Generate Signed Bundle/APK

### iOS
1. Build : `npm run mobile:sync`
2. Ouvrir Xcode : `npx cap open ios`
3. Product > Archive

### Web
```bash
npm run build
# Déployer le dossier `dist/` sur votre serveur
```

## 🔄 Développement

### Mode développement avec live reload
```bash
# Terminal 1 : Serveur de dev
npm run dev

# Terminal 2 : Sync mobile (si needed)
npx cap run android --livereload --external
npx cap run ios --livereload --external
```

### Debug
- **Web** : Outils de développement du navigateur
- **Android** : Chrome DevTools (chrome://inspect)
- **iOS** : Safari Web Inspector

## 🌟 Prochaines étapes

- [ ] Authentification sécurisée (JWT)
- [ ] Synchronisation serveur track-core
- [ ] Mode hors ligne avec SQLite
- [ ] Géolocalisation automatique
- [ ] Notifications push
- [ ] Scan QR/Code-barres
- [ ] Export PDF des rapports

## 📞 Support

- **Capacitor** : https://capacitorjs.com/docs
- **React** : https://react.dev
- **Vite** : https://vitejs.dev

Pour les issues spécifiques au projet, consultez la documentation ou créez une issue.