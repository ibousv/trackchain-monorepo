FROM node:18-alpine

WORKDIR /app

# Copier d'abord les fichiers de dépendances
COPY package.json package-lock.json ./

# Nettoyer et installer toutes les dépendances
RUN rm -rf node_modules && npm install --include=optional

# Copier le reste du code
COPY . .

# Build de l'application
RUN npm run build

# Installation de serve
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]