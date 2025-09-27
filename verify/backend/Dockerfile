FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install
COPY . .
CMD ["node", "src/index.js"]
